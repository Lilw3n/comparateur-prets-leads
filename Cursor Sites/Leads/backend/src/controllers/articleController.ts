import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import articleGenerator from '../services/articleGenerator';

const prisma = new PrismaClient();

// Get all articles with filters and pagination
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      categorie,
      source,
      published,
      search
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (categorie) where.categorie = categorie;
    if (source) where.source = source;
    if (published !== undefined) where.published = published === 'true';
    if (search) {
      // SQLite doesn't support case-insensitive mode, so we use contains
      const searchStr = search as string;
      where.OR = [
        { titre: { contains: searchStr } },
        { resume: { contains: searchStr } },
        { contenu: { contains: searchStr } }
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          lead: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
};

// Get article by slug
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        lead: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { vue: { increment: 1 } }
    });

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
};

// Generate article from user data
export const generateArticle = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    let articleId: string;

    switch (type) {
      case 'comparison':
        articleId = await articleGenerator.generateFromComparison(data, data.leadId);
        break;
      case 'lead':
        const lead = await prisma.lead.findUnique({ where: { id: data.leadId } });
        if (!lead) {
          return res.status(404).json({ error: 'Lead not found' });
        }
        articleId = await articleGenerator.generateFromLead(lead as any);
        break;
      case 'bien-search':
        articleId = await articleGenerator.generateFromBienSearch(data, data.leadId);
        break;
      case 'simulator':
        articleId = await articleGenerator.generateFromSimulator(data, data.leadId);
        break;
      case 'market-analysis':
        articleId = await articleGenerator.generateMarketAnalysis(
          data.typeCredit,
          data.periode,
          data.stats
        );
        break;
      default:
        return res.status(400).json({ error: 'Invalid article type' });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: 'Error generating article', details: error });
  }
};

// Generate article from lead ID
export const generateFromLeadId = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const articleId = await articleGenerator.generateFromLead(lead as any);
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error generating article from lead:', error);
    res.status(500).json({ error: 'Error generating article from lead' });
  }
};

// Generate article from comparison ID
export const generateFromComparisonId = async (req: Request, res: Response) => {
  try {
    const { comparisonId } = req.params;

    const comparison = await prisma.comparaisonPret.findUnique({
      where: { id: comparisonId }
    });

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    // Get offers from comparison
    const offresIds = JSON.parse(comparison.offresIds || '[]');
    const offres = await prisma.offrePret.findMany({
      where: { id: { in: offresIds } }
    });

    const meilleureOffre = comparison.meilleureOffreId
      ? await prisma.offrePret.findUnique({
          where: { id: comparison.meilleureOffreId }
        })
      : offres[0];

    const comparisonData = {
      montant: comparison.montant,
      duree: Math.floor(comparison.duree / 12),
      typeCredit: comparison.typeCredit,
      apport: comparison.apport ?? undefined,
      revenus: comparison.revenus ?? undefined,
      offres,
      meilleureOffre
    };

    const articleId = await articleGenerator.generateFromComparison(
      comparisonData,
      comparison.leadId || undefined
    );

    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error generating article from comparison:', error);
    res.status(500).json({ error: 'Error generating article from comparison' });
  }
};

// Update article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If title changes, regenerate slug
    if (updateData.titre) {
      const existingArticle = await prisma.article.findUnique({ where: { id } });
      if (existingArticle && existingArticle.titre !== updateData.titre) {
        const baseSlug = updateData.titre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .substring(0, 100);
        
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.article.findFirst({ where: { slug, id: { not: id } } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        updateData.slug = slug;
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData
    });

    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Error updating article' });
  }
};

// Delete article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id }
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Error deleting article' });
  }
};

// Get article statistics
export const getArticleStats = async (req: Request, res: Response) => {
  try {
    const [
      total,
      published,
      byCategory,
      bySource,
      totalViews,
      totalLikes,
      recentArticles
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.article.groupBy({
        by: ['categorie'],
        _count: true
      }),
      prisma.article.groupBy({
        by: ['source'],
        _count: true
      }),
      prisma.article.aggregate({
        _sum: { vue: true }
      }),
      prisma.article.aggregate({
        _sum: { likes: true }
      }),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          titre: true,
          slug: true,
          vue: true,
          createdAt: true
        }
      })
    ]);

    res.json({
      total,
      published,
      unpublished: total - published,
      byCategory: byCategory.map(item => ({
        categorie: item.categorie,
        count: item._count
      })),
      bySource: bySource.map(item => ({
        source: item.source,
        count: item._count
      })),
      totalViews: totalViews._sum.vue || 0,
      totalLikes: totalLikes._sum.likes || 0,
      recentArticles
    });
  } catch (error) {
    console.error('Error fetching article stats:', error);
    res.status(500).json({ error: 'Error fetching article stats' });
  }
};

// Get related articles
export const getRelatedArticles = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      select: { categorie: true, tags: true }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const tags = JSON.parse(article.tags || '[]');
    const firstTag = tags[0] || '';

    const related = await prisma.article.findMany({
      where: {
        slug: { not: slug },
        published: true,
        OR: [
          { categorie: article.categorie },
          { tags: { contains: firstTag } }
        ]
      },
      take: 5,
      orderBy: { vue: 'desc' },
      select: {
        id: true,
        titre: true,
        slug: true,
        resume: true,
        imageUrl: true,
        vue: true,
        createdAt: true
      }
    });

    res.json(related);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    res.status(500).json({ error: 'Error fetching related articles' });
  }
};

// Increment article views
export const incrementViews = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.update({
      where: { slug },
      data: { vue: { increment: 1 } }
    });

    res.json({ views: article.vue });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Error incrementing views' });
  }
};

// Like article
export const likeArticle = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.update({
      where: { slug },
      data: { likes: { increment: 1 } }
    });

    res.json({ likes: article.likes });
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ error: 'Error liking article' });
  }
};
