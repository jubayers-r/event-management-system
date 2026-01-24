import { Trash2, Edit3, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ListItemProps {
  title: string;
  imageSrc: string;
  onPublish?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface ListItem {
  id: string;
  title: string;
  image: string;
  status: string;
}

export function ActionableListItem({
  title,
  imageSrc,
  onPublish,
  onEdit,
  onDelete,
}: ListItemProps) {
  const items: ListItem[] = [
    {
      id: "1",
      title: "Project Phoenix",
      image: "https://picsum.photos/seed/1/100",
      status: "Draft",
    },
    {
      id: "2",
      title: "Global Expansion",
      image: "https://picsum.photos/seed/2/100",
      status: "Published",
    },
    {
      id: "3",
      title: "User Research Q1",
      image: "https://picsum.photos/seed/3/100",
      status: "Draft",
    },
    {
      id: "4",
      title: "Brand Guidelines",
      image: "https://picsum.photos/seed/4/100",
      status: "Archived",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Manager</h2>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left Side: Image & Title */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <img
                      src={item.image}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-none tracking-tight text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Updated 2 days ago
                    </p>
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPublish}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publish
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onEdit}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={onDelete}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
