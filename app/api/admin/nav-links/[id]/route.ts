import { supabaseAdmin } from '@/lib/supabase/admin';
import { getAdminSession } from '@/app/utils/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await getAdminSession();
  if (error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { title, section_id } = await req.json();
  if (!title || !section_id) {
    return NextResponse.json({ error: 'Missing title or section_id' }, { status: 400 });
  }

  const { data, error: dbError } = await supabaseAdmin
    .from('admin_nav_links')
    .update({ title, section_id })
    .eq('id', id)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await getAdminSession();
  if (error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { error: dbError } = await supabaseAdmin
    .from('admin_nav_links')
    .delete()
    .eq('id', id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
} 