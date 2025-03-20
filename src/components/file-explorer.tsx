"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/shadcn/utils";
import { FileExplorerFooter } from "~/components/file-explorer-footer";

// ------------------------------
// Types & DFS Index Assignment
// ------------------------------

export type RepoTreeNode = {
    name: string;
    type: "file" | "dir";
    children?: RepoTreeNode[];
};

export type DFSRepoTreeNode = RepoTreeNode & {
    dfsIndex: number;
    children?: DFSRepoTreeNode[];
};

function assignDFSIndices(tree: RepoTreeNode[]): DFSRepoTreeNode[] {
    let currentIndex = 0;

    function traverse(node: RepoTreeNode): DFSRepoTreeNode {
        const dfsNode: DFSRepoTreeNode = {
            ...node,
            dfsIndex: currentIndex++,
        };
        if (node.children) {
            dfsNode.children = node.children.map(traverse);
        }
        return dfsNode;
    }

    return tree.map(traverse);
}

// ------------------------------
// TreeNode
// ------------------------------

type TreeNodeProps = {
    node: DFSRepoTreeNode;
    delay?: number;
    defaultExpanded?: boolean;
    initialAnimationDone?: boolean;
    depth?: number; // indicates nesting level for indentation and lines
};

function TreeNode({
                      node,
                      delay = 50,
                      defaultExpanded = true,
                      initialAnimationDone: globalAnimationDone = false,
                      depth = 0,
                  }: TreeNodeProps) {
    const [isOpen, setIsOpen] = useState(defaultExpanded);
    const [localAnimationDone, setLocalAnimationDone] = useState(globalAnimationDone);

    useEffect(() => {
        // If the global animation is already finished, skip local fade-in.
        if (globalAnimationDone) {
            setLocalAnimationDone(true);
        } else {
            const timer = setTimeout(() => {
                setLocalAnimationDone(true);
            }, node.dfsIndex * delay);
            return () => clearTimeout(timer);
        }
    }, [globalAnimationDone, node.dfsIndex, delay]);

    // Apply the same fade/slide style to the entire node container (including lines).
    const nodeStyle: React.CSSProperties = {
        transition: globalAnimationDone
            ? "none"
            : "opacity 300ms ease-out, transform 300ms ease-out",
        opacity: localAnimationDone ? 1 : 0,
        transform: localAnimationDone ? "translateY(0)" : "translateY(-8px)",
    };

    const isDirectory = node.type === "dir";
    const hasChildren = isDirectory && node.children && node.children.length > 0;

    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <div className="relative" style={{ marginLeft: depth * 16 }}>
            <div
                className="relative flex items-center h-8"
                style={nodeStyle}
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn("ml-4 w-full justify-start gap-2 px-2 hover:bg-accent")}
                    onClick={() => hasChildren && toggleOpen()}
                >
                    {/* Expand/collapse chevron */}
                    {isDirectory ? (
                        hasChildren ? (
                            isOpen ? (
                                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            )
                        ) : (
                            <div className="w-4" />
                        )
                    ) : (
                        <div className="w-4" />
                    )}
                    {/* Folder/File icon */}
                    {isDirectory ? (
                        <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{node.name}</span>
                </Button>
            </div>

            {isOpen && hasChildren && (
                <div className="relative" style={{ marginLeft: 6 }}>
                    <span className="absolute left-6 top-0 bottom-0 border-l border-border" />
                    <div className="ml-0">
                        {node.children?.map((child) => (
                            <TreeNode
                                key={child.dfsIndex}
                                node={child}
                                delay={delay}
                                defaultExpanded={defaultExpanded}
                                initialAnimationDone={globalAnimationDone}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
}

// ------------------------------
// FileExplorer
// ------------------------------

export type FileExplorerProps = {
    tree: RepoTreeNode[];
    delay?: number;
    defaultExpanded?: boolean;
    title?: string;
    className?: string;
};

export function FileExplorer({
                                 tree,
                                 title,
                                 delay = 50,
                                 defaultExpanded = true,
                                 className,
                             }: FileExplorerProps) {
    // Annotate the tree with DFS indices
    const annotatedTree = assignDFSIndices(tree);

    // Determine the maximum DFS index in the tree
    let maxDfsIndex = 0;
    (function traverse(nodes: DFSRepoTreeNode[]) {
        for (const node of nodes) {
            maxDfsIndex = Math.max(maxDfsIndex, node.dfsIndex);
            if (node.children && node.children.length) {
                traverse(node.children);
            }
        }
    })(annotatedTree);

    // total time = max DFS index * delay + fade-in duration
    const totalAnimationTime = maxDfsIndex * delay + 300;
    const [initialAnimationDone, setInitialAnimationDone] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialAnimationDone(true);
        }, totalAnimationTime);
        return () => clearTimeout(timer);
    }, [totalAnimationTime]);

    return (
        <div
            className={cn(
                "w-full rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200",
                className
            )}
        >
            <div className="flex h-full flex-col">
                {title && (
                    <div className="p-4">
                        <div className="flex items-center">
                            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                        </div>
                        <Separator className="my-4 bg-border" />
                    </div>
                )}
                <ScrollArea className="flex-1 h-[calc(100vh-20rem)]">
                    <div className="p-4 space-y-1">
                        {annotatedTree.map((node) => (
                            <TreeNode
                                key={node.dfsIndex}
                                node={node}
                                delay={delay}
                                defaultExpanded={defaultExpanded}
                                initialAnimationDone={initialAnimationDone}
                                depth={0} // Root level
                            />
                        ))}
                    </div>
                </ScrollArea>
                {annotatedTree.length > 0 && <FileExplorerFooter tree={tree} />}
            </div>
        </div>
    );
}
