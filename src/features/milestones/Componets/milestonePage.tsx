import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Plus, Trash2, Pencil,
    CheckCircle, AlertCircle, Loader2, X, Flag
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { getProjectById, updateProjectStatus, deleteProject } from "../../projects/projectThunk";
import {
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
} from "../../milestones/milestoneThunk";
import { clearMessages as clearProjectMessages } from "../../projects/projectSlice";
import { clearMessages as clearMilestoneMessages } from "../../milestones/milestoneSlice";
import type { ProjectStatus } from "../../projects/projectService";
import type {
    MilestoneRecord,
    MilestoneCreateRequest,
    MilestoneUpdateRequest,
} from "../../milestones/milestoneService";

// ─── Constants ────────────────────────────────────────────────────────────────
type MilestoneStatus = NonNullable<MilestoneRecord["status"]>;

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

const MILESTONE_BADGE: Record<MilestoneStatus, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-green-100 text-green-800",
    DELAYED: "bg-red-100 text-red-800",
};

// ─── Milestone Slide-over ─────────────────────────────────────────────────────
function MilestoneSlideOver({
    initial,
    onSubmit,
    onClose,
    submitting,
}: {
    initial?: MilestoneRecord;
    onSubmit: (data: MilestoneCreateRequest | MilestoneUpdateRequest) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const [visible, setVisible] = useState(false);

    // Create uses MilestoneCreateRequest (title + dueDate only)
    // Edit uses MilestoneUpdateRequest (title + status + dueDate)
    const isEdit = !!initial;

    const [title, setTitle] = useState(initial?.title ?? "");
    const [status, setStatus] = useState<MilestoneStatus>(initial?.status ?? "PENDING");
    const [dueDate, setDueDate] = useState(
        initial?.dueDate
            ? new Date(initial.dueDate).toISOString().slice(0, 16)
            : ""
    );

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = () => {
        if (!title.trim() || !dueDate) return;
        if (isEdit) {
            onSubmit({ title: title.trim(), status, dueDate } as MilestoneUpdateRequest);
        } else {
            onSubmit({ title: title.trim(), dueDate } as MilestoneCreateRequest);
        }
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
                    width: "100%", maxWidth: "420px",
                    transition: "transform 300ms ease",
                    transform: visible ? "translateX(0)" : "translateX(100%)",
                }}
                className="bg-surface border-l border-border flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Flag className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {isEdit ? "Edit milestone" : "New milestone"}
                            </p>
                            <p className="text-xs text-text-secondary">
                                Fill in the details below
                            </p>
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
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Design mockups"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputCls}
                            autoFocus
                        />
                    </div>

                    {/* Status only shown when editing — backend defaults to PENDING on create */}
                    {isEdit && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-text-secondary">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                                className={inputCls}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="DELAYED">Delayed</option>
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-text-secondary">
                            Due date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={inputCls}
                        />
                        <p className="text-xs text-text-secondary">
                            Backend expects a date-time value
                        </p>
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
                        disabled={submitting || !title.trim() || !dueDate}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-text-primary text-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEdit ? "Save changes" : "Add milestone"}
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        selectedProject,
        error: projectError,
        successMessage: projectSuccess,
    } = useAppSelector((s) => s.projects);

    const {
        milestones,
        loadingOperation,
        error: milestoneError,
        successMessage: milestoneSuccess,
    } = useAppSelector((s) => s.milestones);

    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<MilestoneRecord | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        dispatch(getProjectById(id));
        dispatch(fetchMilestones(id));
    }, [dispatch, id]);

    // Auto-clear messages
    useEffect(() => {
        if (!projectSuccess && !projectError) return;
        const t = setTimeout(() => dispatch(clearProjectMessages()), 4000);
        return () => clearTimeout(t);
    }, [projectSuccess, projectError, dispatch]);

    useEffect(() => {
        if (!milestoneSuccess && !milestoneError) return;
        const t = setTimeout(() => dispatch(clearMilestoneMessages()), 4000);
        return () => clearTimeout(t);
    }, [milestoneSuccess, milestoneError, dispatch]);

    const handleCreate = async (data: MilestoneCreateRequest | MilestoneUpdateRequest) => {
        if (!id) return;
        setSubmitting(true);
        await dispatch(createMilestone({
            projectId: id,
            data: data as MilestoneCreateRequest,
        }));
        setSubmitting(false);
        setShowCreate(false);
    };

    const handleUpdate = async (data: MilestoneCreateRequest | MilestoneUpdateRequest) => {
        if (!editTarget?.id) return;
        setSubmitting(true);
        await dispatch(updateMilestone({
            milestoneId: editTarget.id,
            data: data as MilestoneUpdateRequest,
        }));
        setSubmitting(false);
        setEditTarget(null);
    };

    const handleDelete = (milestoneId: number) => {
        dispatch(deleteMilestone(milestoneId));
    };

    const handleStatusChange = (status: ProjectStatus) => {
        if (!id) return;
        dispatch(updateProjectStatus({ id, status }));
    };

    const handleDeleteProject = () => {
        if (!selectedProject?.id) return;
        dispatch(deleteProject(selectedProject.id));
        navigate("/dashboard/projects");
    };

    if (!selectedProject) {
        return (
            <div className="flex items-center justify-center py-24 text-sm text-text-secondary">
                Loading project...
            </div>
        );
    }

    const card = "bg-surface border border-border rounded-xl p-6";

    return (
        <div className="flex flex-col gap-6">

            {showCreate && (
                <MilestoneSlideOver
                    onSubmit={handleCreate}
                    onClose={() => setShowCreate(false)}
                    submitting={submitting}
                />
            )}
            {editTarget && (
                <MilestoneSlideOver
                    initial={editTarget}
                    onSubmit={handleUpdate}
                    onClose={() => setEditTarget(null)}
                    submitting={submitting}
                />
            )}

            {/* Back */}
            <button
                onClick={() => navigate("/dashboard/projects")}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to projects
            </button>

            {/* Feedback */}
            {(projectSuccess || milestoneSuccess) && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {projectSuccess || milestoneSuccess}
                </div>
            )}
            {(projectError || milestoneError) && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {projectError || milestoneError}
                </div>
            )}

            {/* Project header */}
            <div className={card}>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-medium truncate">
                            {selectedProject.name}
                        </h2>
                        <p className="text-sm text-text-secondary mt-1">
                            {selectedProject.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                            value={selectedProject.status ?? "PLANNING"}
                            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                            className={`text-xs font-medium px-2 py-1 rounded-full border border-border cursor-pointer bg-surface ${STATUS_BADGE[selectedProject.status ?? "PLANNING"]}`}
                        >
                            {Object.entries(STATUS_LABEL).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleDeleteProject}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete project"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${selectedProject.progressPercentage ?? 0}%` }}
                        />
                    </div>
                    <span className="text-xs text-text-secondary w-8 text-right">
                        {selectedProject.progressPercentage ?? 0}%
                    </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-6 text-xs text-text-secondary">
                    {selectedProject.startDate && (
                        <div>
                            <span className="font-medium text-text-primary">Start </span>
                            {new Date(selectedProject.startDate).toLocaleDateString()}
                        </div>
                    )}
                    {selectedProject.deadline && (
                        <div>
                            <span className="font-medium text-text-primary">Deadline </span>
                            {new Date(selectedProject.deadline).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            {/* Milestones */}
            <div className={card}>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium">
                        Milestones
                        <span className="ml-2 text-xs text-text-secondary font-normal">
                            {milestones.length} total
                        </span>
                    </p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-text-primary text-surface rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-3 h-3" />
                        Add milestone
                    </button>
                </div>

                {loadingOperation === "fetchAll" ? (
                    <div className="py-8 text-center text-sm text-text-secondary">
                        Loading milestones...
                    </div>
                ) : milestones.length === 0 ? (
                    <div className="py-8 text-center text-sm text-text-secondary">
                        No milestones yet — add one to track progress.
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                {["Milestone", "Status", "Due date", "Actions"].map((h) => (
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
                            {milestones.map((m) => (
                                <tr
                                    key={m.id}
                                    className="border-b border-border last:border-0 hover:bg-bg transition-colors"
                                >
                                    <td className="py-3 pr-4 font-medium text-text-primary">
                                        {m.title}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${MILESTONE_BADGE[m.status ?? "PENDING"]}`}>
                                            {(m.status ?? "PENDING").replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-xs text-text-secondary">
                                        {m.dueDate
                                            ? new Date(m.dueDate).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditTarget(m)}
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => m.id && handleDelete(m.id)}
                                                disabled={loadingOperation === "delete"}
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {loadingOperation === "delete"
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <Trash2 className="w-4 h-4" />
                                                }
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