import CreateEvent from "@/components/layout/CreateEventForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex justify-center my-5">
      <CreateEvent eventId={id} />
    </div>
  );
}
