import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List all todos
export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(todos);
}

// POST: Add a new todo
export async function POST(req: NextRequest) {
  const { title } = await req.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  const todo = await prisma.todo.create({ data: { title } });
  return NextResponse.json(todo, { status: 201 });
}

// DELETE: Remove a todo by id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id || typeof id !== 'number') {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 