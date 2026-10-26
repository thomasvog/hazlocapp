import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hallazgos = await prisma.hallazgo.findMany({
      include: { fotos: true },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(hallazgos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevo = await prisma.hallazgo.create({
      data: {
        loc: body.loc,
        tag: body.tag || '',
        zone: body.zone,
        prot: body.prot || 'Otro / N.A.',
        crit: body.crit,
        status: 'pendiente',
        desc: body.desc,
        ins: body.ins || 'Usuario',
        date: body.date,
        fotos: {
          create: (body.antes || []).map((url: string) => ({ url, tipo: 'antes' }))
        }
      },
      include: { fotos: true }
    });
    return NextResponse.json(nuevo);
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}
