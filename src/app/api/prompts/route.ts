import { NextResponse } from 'next/server';
import { PromptManager } from '@/lib/ai/prompt-manager/manager';

// GET: List all prompt templates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');

    // Run migration on first access
    const { migrateExistingPrompts } = await import('@/lib/ai/prompt-manager/migrate');
    migrateExistingPrompts();

    const templates = PromptManager.listTemplates({
      category: category || undefined,
      status: status || undefined,
      tag: tag || undefined,
    });

    return NextResponse.json({ success: true, data: templates });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to get prompt list' }, { status: 500 });
  }
}

// POST: Create new prompt template
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const template = PromptManager.createTemplate({
      name: body.name,
      category: body.category,
      description: body.description,
      systemPrompt: body.systemPrompt,
      userPrompt: body.userPrompt,
      variables: body.variables || [],
      tags: body.tags || [],
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, data: template });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create prompt' }, { status: 500 });
  }
}

// PUT: Update prompt template
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const template = PromptManager.updateTemplate(id, updates);
    if (!template) {
      return NextResponse.json({ success: false, error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: template });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update prompt' }, { status: 500 });
  }
}

// DELETE: Delete prompt template
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    const success = PromptManager.deleteTemplate(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete prompt' }, { status: 500 });
  }
}
