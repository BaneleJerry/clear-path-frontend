import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
    Plus, Search, Trash2, ArrowRight,
    AlertCircle, CheckCircle, Loader2, X, FolderKanban
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { fetchProjects, createProject, deleteProject } from "../projectThunk";
import { clearMessages } from "../projectSlice";
import { fetchOrganizations } from "../../organization/orgThunk";
import type { ProjectCreateRequest, ProjectRecord, ProjectStatus } from "../projectService";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<ProjectStatus, string> = {
    PLANNING: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    ON_HOLD: "bg-gray-100 text-gray-600",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
    PLANNING: "Planning",
    IN_PROGRESS: "In Progress",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

// ─── Confirm Delete ───────────────────────────────────────────────────────────
function ConfirmDialog({
    project,
    onConfirm,
    onCancel,
}: {
    project: ProjectRecord;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return createPortal(
        <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        }}>
            <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm mx-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Delete project</p>
                        <p className="text-xs text-text-secondary">This cannot be undone</p>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-text-primary">{project.name}</span>?
                </p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Create Slide-over ────────────────────────────────────────────────────────
function CreateSlideOver({
    onSubmit,
    onClose,
    submitting,
}: {
    onSubmit: (data: ProjectCreateRequest) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const { organizations } = useAppSelector((s) => s.organizations);
    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState<ProjectCreateRequest>({
        name: "",
        organizationId: "",
    });

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = () => {
        if (!form.name.trim() || !form.organizationId) return;
        onSubmit(form);
    };

    const inputCls =
        "w-full text-sm px-3 py-2 border border-border rounded-lg bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 40,
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
                    transition: "opacity 300ms ease",
                    opacity: visible ? 1 : 0,
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
                    width: "100%", maxWidth: "480px",
                    transition: "transform 300ms ease",
                    transform: visible ? "translateX(0)" : "translateX(100%)",
                }}
                className="bg-surface border-l border-border flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <FolderKanban className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">New project</p>
                            <p className="text-xs text-text-secondary">Fill in the details below</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-text-secondary">
                            Project name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Website Redesign"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputCls}
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-text-secondary">
                            Description
                        </label>
                        <textarea
                            placeholder="What is this project about?"
                            value={form.description ?? ""}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className={`${inputCls} resize-none`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-text-secondary">
                            Organisation <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.organizationId}
                            onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
                            className={inputCls}
                        >
                            <option value="">Select organisation...</option>
                            {organizations.map((o) => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-medium text-text-secondary">
                                Start date
                            </label>
                            <input
                                type="date"
                                value={form.startDate ?? ""}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-medium text-text-secondary">
                                Deadline
                            </label>
                            <input
                                type="date"
                                value={form.deadline ?? ""}
                                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !form.name.trim() || !form.organizationId}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-text-primary text-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Create project
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { projects, loading, error, successMessage } =
        useAppSelector((s) => s.projects);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showCreate, setShowCreate] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ProjectRecord | null>(null);

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchOrganizations());
    }, [dispatch]);

    useEffect(() => {
        if (!successMessage && !error) return;
        const t = setTimeout(() => dispatch(clearMessages()), 4000);
        return () => clearTimeout(t);
    }, [successMessage, error, dispatch]);

    const handleCreate = async (data: ProjectCreateRequest) => {
        setSubmitting(true);
        await dispatch(createProject(data));
        setSubmitting(false);
        setShowCreate(false);
    };

    const handleDelete = () => {
        if (!deleteTarget?.id) return;
        dispatch(deleteProject(deleteTarget.id));
        setDeleteTarget(null);
    };

    const filtered = projects.filter((p) => {
        const matchSearch =
            search === "" ||
            p.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            statusFilter === "all" || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const card = "bg-surface border border-border rounded-xl p-6";
    const inputCls = "text-sm px-3 py-2 border border-border rounded-lg bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

    return (
        <div className="flex flex-col gap-6">

            {showCreate && (
                <CreateSlideOver
                    onSubmit={handleCreate}
                    onClose={() => setShowCreate(false)}
                    submitting={submitting}
                />
            )}
            {deleteTarget && (
                <ConfirmDialog
                    project={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium">Projects</h2>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage all projects across organisations
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-text-primary text-surface text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New project
                </button>
            </div>

            {/* Feedback */}
            {successMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className={card}>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputCls} pl-9 w-full`}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={inputCls}
                    >
                        <option value="all">All statuses</option>
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <span className="text-xs text-text-secondary ml-auto">
                        {filtered.length} of {projects.length} projects
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className={card}>
                {loading ? (
                    <div className="py-12 text-center text-sm text-text-secondary">
                        Loading projects...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-12 text-center text-sm text-text-secondary">
                        No projects found.
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                {["Project", "Status", "Progress", "Deadline", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider pb-3 border-b border-border"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((project) => (
                                <tr
                                    key={project.id}
                                    className="border-b border-border last:border-0 hover:bg-bg transition-colors cursor-pointer"
                                    onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                                >
                                    {/* Project */}
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <FolderKanban className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-text-primary">
                                                    {project.name}
                                                </p>
                                                <p className="text-xs text-text-secondary line-clamp-1">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 pr-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[project.status ?? "PLANNING"]}`}>
                                            {STATUS_LABEL[project.status ?? "PLANNING"]}
                                        </span>
                                    </td>

                                    {/* Progress */}
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden min-w-16">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${project.progressPercentage ?? 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-text-secondary w-8">
                                                {project.progressPercentage ?? 0}%
                                            </span>
                                        </div>
                                    </td>

                                    {/* Deadline */}
                                    <td className="py-3 pr-4 text-xs text-text-secondary">
                                        {project.deadline
                                            ? new Date(project.deadline).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                                                title="View"
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(project)}
                                                title="Delete"
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}