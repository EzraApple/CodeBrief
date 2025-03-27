import {calculateLanguageBreakdown, type RepoTreeNode} from "~/lib/github";

export function FileExplorerFooter({ tree }: { tree: RepoTreeNode[] }) {
    // Calculate the language breakdown using your getLanguageBreakdown helper
    const breakdown = calculateLanguageBreakdown(tree);

    return (
        <div className="mb-4 border-t p-4">
            <h3 className="mb-2 text-sm font-semibold">Languages</h3>
            {/* The horizontal bar */}
            <div className="mb-3 flex h-4 w-full overflow-hidden rounded bg-muted">
                {breakdown.map((item) => (
                    <div
                        key={item.language}
                        className="h-full"
                        style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                        }}
                        title={`${item.language}: ${item.percentage.toFixed(1)}%`}
                    />
                ))}
            </div>

            {/* The legend */}
            <div className="flex flex-wrap gap-3 text-sm">
                {breakdown.map((item) => (
                    <div className="flex items-center gap-2" key={item.language}>
            <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
            />
                        <span>
              {item.language} {item.percentage.toFixed(1)}%
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
