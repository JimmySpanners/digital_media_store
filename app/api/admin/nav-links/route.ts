import { supabaseAdmin } from '@/lib/supabase/admin';
import { getAdminSession } from '@/app/utils/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Public: no admin check
  const { data, error: dbError } = await supabaseAdmin
    .from('admin_nav_links')
    .select('*')
    .order('created_at', { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { session, error } = await getAdminSession();
  if (error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, section_id } = await req.json();
  if (!title || !section_id) {
    return NextResponse.json({ error: 'Missing title or section_id' }, { status: 400 });
  }

  const { data, error: dbError } = await supabaseAdmin
    .from('admin_nav_links')
    .insert([{ title, section_id }])
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
} 