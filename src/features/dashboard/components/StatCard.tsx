type Props = {
    label: string;
    value: number | string;
    loading?: boolean;
};

export default function StatCard({ label, value, loading }: Props) {
    return (
        <div className="flex-1 min-w-0 bg-surface rounded-xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-2">{label}</p>
            {loading ? (
                <div className="h-7 w-14 rounded-md bg-border/40 animate-pulse" />
            ) : (
                <p className="text-2xl font-medium">{value}</p>
            )}
        </div>
    );
}