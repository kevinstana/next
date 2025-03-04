"use client";

import { getThesisCourses } from "@/lib/server-actions";
import { Course } from "@/types/app-types";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import ViewingRecommendedCourses from "./Viewing";
import EditingRecommendedCourses from "./Editing";

export default function RecommendedCourses({
  thesisId,
  type,
  handleCourseChange,
  setInitCourses,
}: {
  thesisId: string;
  type: "viewing" | "editing";
  handleCourseChange?: (trigger: "add" | "remove", course: Course) => void,
  setInitCourses: (courses: Course[]) => void
}) {
  const { data, isLoading } = useSWR(
    () => (thesisId ? ["thesis-courses", thesisId] : null),
    () => getThesisCourses(thesisId),
    {
      onSuccess: (res) => {
        setInitCourses(res.data as Course[])
      },
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const courses = data?.data as Course[];

  if (isLoading) {
    return <Skeleton className="bg-neutral-100 h-4 w-4" />;
  }

  if (type === "viewing") {
    return <ViewingRecommendedCourses courses={courses} />;
  }

  return <EditingRecommendedCourses handleCourseChange={handleCourseChange} courses={courses} />;
}
