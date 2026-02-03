import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enregistrer une nouvelle visite
export const trackVisit = async (req: Request, res: Response) => {
  try {
    const { sessionId, page, referrer, userAgent, ip, deviceType, browser, os, pays, ville } = req.body;

    if (!sessionId || !page) {
      return res.status(400).json({ error: 'sessionId et page sont requis' });
    }

    // Vérifier si cette visite n'a pas déjà été enregistrée aujourd'hui pour cette session et cette page
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingVisit = await prisma.visite.findFirst({
      where: {
        sessionId,
        page,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingVisit) {
      return res.json({ 
        success: true, 
        message: 'Visite déjà enregistrée aujourd\'hui',
        visit: existingVisit 
      });
    }

    const visite = await prisma.visite.create({
      data: {
        sessionId,
        page,
        referrer: referrer || null,
        userAgent: userAgent || null,
        ip: ip || null,
        deviceType: deviceType || null,
        browser: browser || null,
        os: os || null,
        pays: pays || null,
        ville: ville || null
      }
    });

    res.json({ success: true, visit: visite });
  } catch (error: any) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les statistiques globales
export const getStats = async (req: Request, res: Response) => {
  try {
    const { period = 'all' } = req.query; // all, day, week, month, year

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // Toutes les visites
    }

    const where = period !== 'all' ? {
      createdAt: { gte: startDate }
    } : {};

    // Total de visites
    const totalVisits = await prisma.visite.count({ where });

    // Visites uniques (sessions uniques)
    const uniqueVisits = await prisma.visite.groupBy({
      by: ['sessionId'],
      where,
      _count: true
    });

    // Pages les plus visitées
    const topPages = await prisma.visite.groupBy({
      by: ['page'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    // Statistiques par jour
    const visitsByDay = await prisma.visite.findMany({
      where,
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Grouper par jour
    const dailyStats: Record<string, number> = {};
    visitsByDay.forEach(visite => {
      const dateKey = visite.createdAt.toISOString().split('T')[0];
      dailyStats[dateKey] = (dailyStats[dateKey] || 0) + 1;
    });

    // Statistiques par appareil
    const deviceStats = await prisma.visite.groupBy({
      by: ['deviceType'],
      where: {
        ...where,
        deviceType: { not: null }
      },
      _count: {
        id: true
      }
    });

    // Statistiques par navigateur
    const browserStats = await prisma.visite.groupBy({
      by: ['browser'],
      where: {
        ...where,
        browser: { not: null }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    res.json({
      period,
      totalVisits,
      uniqueVisits: uniqueVisits.length,
      topPages: topPages.map(p => ({
        page: p.page,
        count: p._count.id
      })),
      dailyStats: Object.entries(dailyStats).map(([date, count]) => ({
        date,
        count
      })),
      deviceStats: deviceStats.map(d => ({
        device: d.deviceType,
        count: d._count.id
      })),
      browserStats: browserStats.map(b => ({
        browser: b.browser,
        count: b._count.id
      }))
    });
  } catch (error: any) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les statistiques détaillées par jour
export const getDailyStats = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days as string, 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const visits = await prisma.visite.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        page: true,
        sessionId: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Grouper par jour et par page
    const stats: Record<string, { total: number; unique: number; pages: Record<string, number> }> = {};

    visits.forEach(visite => {
      const dateKey = visite.createdAt.toISOString().split('T')[0];
      if (!stats[dateKey]) {
        stats[dateKey] = { total: 0, unique: 0, pages: {} };
      }
      stats[dateKey].total++;
      if (!stats[dateKey].pages[visite.page]) {
        stats[dateKey].pages[visite.page] = 0;
      }
      stats[dateKey].pages[visite.page]++;
    });

    // Compter les sessions uniques par jour
    const uniqueSessionsByDay: Record<string, Set<string>> = {};
    visits.forEach(visite => {
      const dateKey = visite.createdAt.toISOString().split('T')[0];
      if (!uniqueSessionsByDay[dateKey]) {
        uniqueSessionsByDay[dateKey] = new Set();
      }
      uniqueSessionsByDay[dateKey].add(visite.sessionId);
    });

    const result = Object.entries(stats).map(([date, data]) => ({
      date,
      total: data.total,
      unique: uniqueSessionsByDay[date]?.size || 0,
      pages: Object.entries(data.pages).map(([page, count]) => ({
        page,
        count
      })).sort((a, b) => b.count - a.count)
    }));

    res.json(result);
  } catch (error: any) {
    console.error('Error getting daily stats:', error);
    res.status(500).json({ error: error.message });
  }
};
