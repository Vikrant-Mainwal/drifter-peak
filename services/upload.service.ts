import { createClient } from "@/lib/supabase/client";

export async function uploadImages(files: File[]) {
  const supabase = createClient(); // use correct client
  const urls: string[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
}