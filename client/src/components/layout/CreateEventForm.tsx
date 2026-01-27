"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
  createEventFormSchema,
  updateEventFormSchema,
} from "@/lib/zod/CreateEventForm";
import { useCreate } from "@/hooks/useCreate";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useEvent } from "@/hooks/useEvent";

export default function CreateEvent({ eventId }: { eventId?: string }) {
  const pathname = usePathname();
  const isUpdate = pathname === `/events/${eventId}/update`;

  const { createEvent, updateEvent } = useCreate();

  const schema = isUpdate ? updateEventFormSchema : createEventFormSchema;

  type EventFormValue =
    | z.infer<typeof createEventFormSchema>
    | z.infer<typeof updateEventFormSchema>;

  const form = useForm<EventFormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      date_time: null,
      location: "",
      people_capacity: 0,
      joining_fee: 0,
    },
  });
  const { getEventById } = useEvent();

  useEffect(() => {
    if (!isUpdate || !eventId) return;

    async function loadEvent() {
      const event = await getEventById(eventId);

      form.reset({
        name: event.name,
        date_time: new Date(event.date_time),
        location: event.location,
        people_capacity: event.people_capacity,
        joining_fee: event.joining_fee,
      });
    }

    loadEvent();
  }, [eventId, isUpdate, form]);

  async function onSubmit(data: z.infer<typeof createEventFormSchema>) {
    try {
      {
        if (isUpdate) {
          await createEvent({
            name: data.name,

            date_time: data.date_time,

            location: data.location,

            people_capacity: data.people_capacity,

            joining_fee: data.joining_fee,
          });
        } else {
          await updateEvent({
            id: eventId,
            name: data.name,

            date_time: data.date_time,

            location: data.location,

            people_capacity: data.people_capacity,

            joining_fee: data.joining_fee,
          });
        }
      }

      toast.success("Event created successfully", {
        description: (
          <pre className="mt-2 rounded-md bg-zinc-900 p-3 text-xs text-white">
            {JSON.stringify(data, null, 2)}
          </pre>
        ),
        position: "bottom-right",
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{isUpdate ? "Update Event" : "Create Event"}</CardTitle>
        <CardDescription>
          {isUpdate
            ? "Fill in the details to update your existing event"
            : "Fill in the details to create a new event"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="create-event-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Event Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Event Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Global Tech Summit"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Date Time */}
            <Controller
              name="date_time"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date & Time</FieldLabel>

                  <Input
                    type="datetime-local"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null,
                      );
                    }}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Location */}
            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Convention Center, SF"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Capacity */}
            <Controller
              name="people_capacity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>People Capacity</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Joining Fee */}
            <Controller
              name="joining_fee"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Joining Fee</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Manager ID */}
            {/* <Controller
              name="managerId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Manager ID</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Manager user id"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} */}
            {/* /> */}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>

          <Button
            type="submit"
            form="create-event-form"
            onClick={() => {
              console.log("values", form.getValues());
              console.log("errors", form.formState.errors);
            }}
          >
            {isUpdate ? "Update" : "Create"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}










// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import * as z from "zod";
// import { useEffect } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";

// import {
//   createEventFormSchema,
//   updateEventFormSchema,
// } from "@/lib/zod/CreateEventForm";
// import { useEvent } from "@/hooks/useEvent";
// import { useCreate } from "@/hooks/useCreate";


// export default function CreateEvent({ eventId }: { eventId?: string }) {
//   const isUpdate = Boolean(eventId);

//   const schema = isUpdate
//     ? updateEventFormSchema
//     : createEventFormSchema;

//   type EventFormValue =
//     | z.infer<typeof createEventFormSchema>
//     | z.infer<typeof updateEventFormSchema>;

//   const form = useForm<EventFormValue>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       name: "",
//       date_time: null,
//       location: "",
//       people_capacity: 0,
//       joining_fee: 0,
//     },
//   });

//   const { getEventById } = useEvent();

//   // ✅ Load existing event (UPDATE MODE)
//   useEffect(() => {
//     if (!isUpdate || !eventId) return;

//     async function loadEvent() {
//       try {
//         const event = await getEventById(eventId!);

//         form.reset({
//           name: event.name,
//           date_time: new Date(event.date_time),
//           location: event.location,
//           people_capacity: event.people_capacity,
//           joining_fee: event.joining_fee,
//         });
//       } catch (err: any) {
//         toast.error(err.message || "Failed to load event");
//       }
//     }

//     loadEvent();
//   }, [eventId, isUpdate, form, getEventById]);

//  const {createEvent, updateEvent} = useCreate()

//   // ✅ Correct submit logic
//   async function onSubmit(data: EventFormValue) {
//     try {
//       if (isUpdate && eventId) {
//         await updateEvent(eventId);
//         toast.success("Event updated successfully");
//       } else {
//         await createEvent(data);
//         toast.success("Event created successfully");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong");
//     }
//   }

//   return (
//     <Card className="w-full sm:max-w-md">
//       <CardHeader>
//         <CardTitle>{isUpdate ? "Update Event" : "Create Event"}</CardTitle>
//         <CardDescription>
//           {isUpdate
//             ? "Update your existing event"
//             : "Create a new event"}
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form id="event-form" onSubmit={form.handleSubmit(onSubmit)}>
//           <FieldGroup>
//             <Controller
//               name="name"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel>Event Name</FieldLabel>
//                   <Input {...field} />
//                   {fieldState.error && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />

//             <Controller
//               name="date_time"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel>Date & Time</FieldLabel>
//                   <Input
//                     type="datetime-local"
//                     value={
//                       field.value
//                         ? new Date(field.value).toISOString().slice(0, 16)
//                         : ""
//                     }
//                     onChange={(e) =>
//                       field.onChange(
//                         e.target.value
//                           ? new Date(e.target.value)
//                           : null,
//                       )
//                     }
//                   />
//                   {fieldState.error && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />

//             <Controller
//               name="location"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel>Location</FieldLabel>
//                   <Input {...field} />
//                   {fieldState.error && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />

//             <Controller
//               name="people_capacity"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel>People Capacity</FieldLabel>
//                   <Input
//                     type="number"
//                     {...field}
//                     onChange={(e) =>
//                       field.onChange(Number(e.target.value))
//                     }
//                   />
//                   {fieldState.error && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />

//             <Controller
//               name="joining_fee"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel>Joining Fee</FieldLabel>
//                   <Input
//                     type="number"
//                     {...field}
//                     onChange={(e) =>
//                       field.onChange(Number(e.target.value))
//                     }
//                   />
//                   {fieldState.error && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//           </FieldGroup>
//         </form>
//       </CardContent>

//       <CardFooter>
//         <Button type="submit" form="event-form">
//           {isUpdate ? "Update" : "Create"}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
