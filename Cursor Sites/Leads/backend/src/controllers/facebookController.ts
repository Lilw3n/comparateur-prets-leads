import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Connexion à une page Facebook
export const connectPage = async (req: Request, res: Response) => {
  try {
    const { pageId, pageName, accessToken, category } = req.body;

    if (!pageId || !pageName || !accessToken) {
      return res.status(400).json({ error: 'pageId, pageName et accessToken sont requis' });
    }

    // Vérifier si la page existe déjà
    let page = await prisma.facebookPage.findUnique({
      where: { pageId }
    });

    if (page) {
      // Mettre à jour le token
      page = await prisma.facebookPage.update({
        where: { pageId },
        data: {
          accessToken,
          pageName,
          category: category || null,
          active: true
        }
      });
    } else {
      // Créer une nouvelle page
      page = await prisma.facebookPage.create({
        data: {
          pageId,
          pageName,
          accessToken,
          category: category || null
        }
      });
    }

    res.json({ success: true, page });
  } catch (error: any) {
    console.error('Error connecting Facebook page:', error);
    res.status(500).json({ error: error.message });
  }
};

// Publier un article sur Facebook
export const publishPost = async (req: Request, res: Response) => {
  try {
    const { pageId, message, link, imageUrl, articleId, scheduledAt } = req.body;

    if (!pageId || !message) {
      return res.status(400).json({ error: 'pageId et message sont requis' });
    }

    const page = await prisma.facebookPage.findUnique({
      where: { pageId }
    });

    if (!page || !page.active) {
      return res.status(404).json({ error: 'Page Facebook non trouvée ou inactive' });
    }

    // Créer le post dans la base de données
    const post = await prisma.facebookPost.create({
      data: {
        pageId: page.id,
        message,
        link: link || null,
        imageUrl: imageUrl || null,
        articleId: articleId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        published: !scheduledAt // Si pas de date programmée, publier immédiatement
      }
    });

    // Si publication immédiate, publier sur Facebook
    if (!scheduledAt) {
      try {
        const facebookResponse = await publishToFacebook(page.accessToken, page.pageId, {
          message,
          link,
          attached_media: imageUrl ? [{ media_fbid: imageUrl }] : undefined
        });

        // Mettre à jour avec l'ID Facebook
        await prisma.facebookPost.update({
          where: { id: post.id },
          data: {
            facebookPostId: facebookResponse.id,
            published: true,
            publishedAt: new Date()
          }
        });

        res.json({ success: true, post: { ...post, facebookPostId: facebookResponse.id } });
      } catch (fbError: any) {
        console.error('Error publishing to Facebook:', fbError);
        res.status(500).json({ 
          error: 'Erreur lors de la publication sur Facebook',
          details: fbError.message,
          post // Retourner le post créé même en cas d'erreur
        });
      }
    } else {
      res.json({ success: true, post, message: 'Post programmé avec succès' });
    }
  } catch (error: any) {
    console.error('Error publishing post:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction helper pour publier sur Facebook
const publishToFacebook = async (accessToken: string, pageId: string, data: any) => {
  const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
  
  const params: any = {
    access_token: accessToken,
    message: data.message
  };

  if (data.link) {
    params.link = data.link;
  }

  const response = await axios.post(url, params);
  return response.data;
};

// Obtenir tous les posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { pageId, published } = req.query;

    const where: any = {};
    if (pageId) {
      const page = await prisma.facebookPage.findUnique({ where: { pageId: pageId as string } });
      if (page) {
        where.pageId = page.id;
      }
    }
    if (published !== undefined) {
      where.published = published === 'true';
    }

    const posts = await prisma.facebookPost.findMany({
      where,
      include: {
        page: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ posts });
  } catch (error: any) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: error.message });
  }
};

// Synchroniser les métriques d'un post
export const syncPostMetrics = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await prisma.facebookPost.findUnique({
      where: { id: postId },
      include: { page: true }
    });

    if (!post || !post.facebookPostId) {
      return res.status(404).json({ error: 'Post non trouvé ou non publié sur Facebook' });
    }

    // Récupérer les métriques depuis Facebook
    const url = `https://graph.facebook.com/v18.0/${post.facebookPostId}`;
    const response = await axios.get(url, {
      params: {
        access_token: post.page.accessToken,
        fields: 'likes.summary(true),comments.summary(true),shares,insights.metric(post_impressions,post_reach)'
      }
    });

    const metrics = response.data;
    
    // Mettre à jour les métriques
    await prisma.facebookPost.update({
      where: { id: postId },
      data: {
        likes: metrics.likes?.summary?.total_count || 0,
        comments: metrics.comments?.summary?.total_count || 0,
        shares: metrics.shares?.count || 0,
        impressions: metrics.insights?.data?.find((i: any) => i.name === 'post_impressions')?.values?.[0]?.value || 0,
        reach: metrics.insights?.data?.find((i: any) => i.name === 'post_reach')?.values?.[0]?.value || 0
      }
    });

    res.json({ success: true, message: 'Métriques synchronisées' });
  } catch (error: any) {
    console.error('Error syncing metrics:', error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les leads depuis Facebook
export const getLeads = async (req: Request, res: Response) => {
  try {
    const { pageId, imported } = req.query;

    const where: any = {};
    if (imported !== undefined) {
      where.imported = imported === 'true';
    }

    const leads = await prisma.facebookLead.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    res.json({ leads });
  } catch (error: any) {
    console.error('Error getting leads:', error);
    res.status(500).json({ error: error.message });
  }
};

// Importer un lead Facebook dans le système
export const importLead = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;

    const facebookLead = await prisma.facebookLead.findUnique({
      where: { id: leadId }
    });

    if (!facebookLead) {
      return res.status(404).json({ error: 'Lead Facebook non trouvé' });
    }

    if (facebookLead.imported) {
      return res.json({ success: true, message: 'Lead déjà importé', leadId: facebookLead.leadId });
    }

    // Créer un lead dans le système
    const lead = await prisma.lead.create({
      data: {
        nom: facebookLead.nom || 'Inconnu',
        prenom: facebookLead.prenom || '',
        email: facebookLead.email || '',
        telephone: facebookLead.telephone || '',
        secteur: 'AUTRE',
        source: 'FACEBOOK',
        notes: `Lead importé depuis Facebook - Form: ${facebookLead.formName || 'N/A'} - Ad: ${facebookLead.adName || 'N/A'}`
      }
    });

    // Marquer comme importé
    await prisma.facebookLead.update({
      where: { id: leadId },
      data: {
        imported: true,
        leadId: lead.id
      }
    });

    res.json({ success: true, lead, facebookLead });
  } catch (error: any) {
    console.error('Error importing lead:', error);
    res.status(500).json({ error: error.message });
  }
};
