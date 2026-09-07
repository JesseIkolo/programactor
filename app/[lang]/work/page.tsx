import { redirect } from "next/navigation";

export default async function WorkRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/realisations`);
}
