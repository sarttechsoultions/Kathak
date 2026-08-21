import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CourseDetailView from "@/components/courses/CourseDetailView";
import { getPublicCourse, getPublicCourseSlugs } from "@/lib/publicCourses";

export function generateStaticParams() {
  return getPublicCourseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getPublicCourse(slug);
  if (!course) {
    return { title: "Course | Kathak by Harshita" };
  }
  return {
    title: `${course.title} | Kathak by Harshita`,
    description: course.intro,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getPublicCourse(slug);
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col overflow-x-clip selection:bg-[#C10F3A] selection:text-white">
      <SiteHeader />
      <main className="flex-1">
        <CourseDetailView course={course} />
      </main>
      <Footer />
    </div>
  );
}
