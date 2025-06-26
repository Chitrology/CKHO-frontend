"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance, { getErrorMessage } from "@/utils/axios";
import CourseForm, { CourseFormData } from "@/components/CourseForm";
import ModuleForm, { ModuleFormData } from "@/components/ModuleForm";
import ContentForm, { ContentFormData } from "@/components/ContentForm";

// Define a more detailed Course type for the edit page
type Module = {
  id: string;
  title: string;
  description: string;
  order: number;
  contents: Content[];
};

type Content = {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ" | "ASSIGNMENT";
  order: number;
  url?: string;
};

type Course = Omit<CourseFormData, 'tags' | 'prerequisites'> & {
  id: string;
  tags: string[];
  prerequisites: string[];
  modules: Module[];
};

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [modules, setModules] = useState<Module[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [activeModuleForContent, setActiveModuleForContent] = useState<Module | null>(null);

  useEffect(() => {
    if (!courseId) return;
    async function fetchCourse() {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/courses/${courseId}`);
        setCourse(res.data);
        setModules(res.data.modules || []);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="text-center p-8">Loading course data...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!course) return <div className="text-center p-8">Course not found.</div>;

  return (
    <main className="min-h-[60vh] p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Course: {course.title}</h2>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`${
              activeTab === 'modules'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Modules & Content
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'details' && (
          <CourseForm initialData={course} courseId={course.id} />
        )}
        {activeTab === 'modules' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Manage Modules</h3>
              <button
                className="px-4 py-2 bg-pink-600 text-white rounded"
                onClick={() => { setEditModule(null); setShowModuleForm(true); }}
              >
                + Add Module
              </button>
            </div>
            {modules.length === 0 ? (
              <p className="text-gray-500">No modules yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {modules.sort((a, b) => a.order - b.order).map((mod, idx) => (
                  <li key={mod.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{mod.title}</div>
                        <div className="text-gray-500 text-sm">{mod.description}</div>
                        <div className="text-xs text-gray-400">Order: {mod.order}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => { setEditModule(mod); setShowModuleForm(true); }}
                        >Edit</button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            if (confirm('Delete this module?')) {
                              await axiosInstance.delete(`/api/courses/modules/${mod.id}`);
                              setModules(modules.filter(m => m.id !== mod.id));
                            }
                          }}
                        >Delete</button>
                      </div>
                    </div>
                    {/* Content Management UI */}
                    <div className="mt-4 ml-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Content</span>
                        <button
                          className="px-2 py-1 bg-pink-500 text-white rounded text-xs"
                          onClick={() => {
                            setActiveModuleForContent(mod);
                            setEditContent(null);
                            setShowContentForm(true);
                          }}
                        >+ Add Content</button>
                      </div>
                      {mod.contents.length === 0 ? (
                        <p className="text-gray-400 text-xs">No content yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {mod.contents.sort((a, b) => a.order - b.order).map(content => (
                            <li key={content.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{content.title}</span>
                                <span className="ml-2 text-xs text-gray-500">({content.type})</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="px-2 py-1 bg-blue-400 text-white rounded text-xs"
                                  onClick={() => {
                                    setActiveModuleForContent(mod);
                                    setEditContent(content);
                                    setShowContentForm(true);
                                  }}
                                >Edit</button>
                                <button
                                  className="px-2 py-1 bg-red-400 text-white rounded text-xs"
                                  onClick={async () => {
                                    if (confirm('Delete this content?')) {
                                      await axiosInstance.delete(`/api/courses/content/${content.id}`);
                                      // Refresh modules
                                      const res = await axiosInstance.get(`/api/courses/${courseId}`);
                                      setModules(res.data.modules || []);
                                    }
                                  }}
                                >Delete</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showModuleForm && (
              <ModuleForm
                open={showModuleForm}
                onClose={() => { setShowModuleForm(false); setEditModule(null); }}
                onSubmit={async (data: ModuleFormData) => {
                  if (editModule) {
                    // Edit
                    await axiosInstance.patch(`/api/courses/modules/${editModule.id}`, data);
                  } else {
                    // Create
                    await axiosInstance.post(`/api/courses/${courseId}/modules`, data);
                  }
                  // Refresh modules
                  const res = await axiosInstance.get(`/api/courses/${courseId}`);
                  setModules(res.data.modules || []);
                  setShowModuleForm(false);
                  setEditModule(null);
                }}
                initialData={editModule || undefined}
              />
            )}
            {showContentForm && activeModuleForContent && (
              <ContentForm
                open={showContentForm}
                onClose={() => { setShowContentForm(false); setEditContent(null); setActiveModuleForContent(null); }}
                onSubmit={async (data: Partial<ContentFormData>) => {
                  if (editContent) {
                    // Edit
                    await axiosInstance.patch(`/api/courses/content/${editContent.id}`, data);
                  } else {
                    // Create
                    await axiosInstance.post(`/api/courses/modules/${activeModuleForContent.id}/content`, data);
                  }
                  // Refresh modules
                  const res = await axiosInstance.get(`/api/courses/${courseId}`);
                  setModules(res.data.modules || []);
                  setShowContentForm(false);
                  setEditContent(null);
                  setActiveModuleForContent(null);
                }}
                initialData={editContent || undefined}
                moduleId={activeModuleForContent.id}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
} 