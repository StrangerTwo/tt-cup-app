#!/usr/bin/env node

const { execSync } = require("node:child_process");
const { writeFileSync } = require("node:fs");

const REPOSITORY_NAME = "StrangerTwo/tt-cup-app";
const OUTPUT_FILE = "README.md";

const spendRegex = /\/spend\s+(\d+h)?(\d+m)?/gi;
const issueRegex = /(?:(?<repository>[\w.-]+\/[\w.-]+))?#(?<number>\d+)\s*[-–—]?\s*(?<title>.*)/i;

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSpendMatch(hoursPart, minutesPart) {
    const hours = hoursPart ? Number(hoursPart.replace("h", "")) : 0;
    const minutes = minutesPart ? Number(minutesPart.replace("m", "")) : 0;

    return hours * 60 + minutes;
}

function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}h${minutes}m`;
    }

    if (hours > 0) {
        return `${hours}h`;
    }

    return `${minutes}m`;
}

function formatDateTime(value) {
    return new Date(value).toLocaleString("cs");
}

function isCountedCommit(commit) {
    return commit.authorName !== "github-actions[bot]";
}

function getIssueGroupId(issue) {
    if (!issue) {
        return "no-issue";
    }

    return `issue-${issue.repository}#${issue.number}`;
}

function parseCommit(rawCommit) {
    const parts = rawCommit.split("\x1f");

    if (parts.length < 4) {
        return null;
    }

    const [hash, date, authorName, ...bodyParts] = parts;

    return {
        hash,
        date,
        authorName,
        body: bodyParts.join("\x1f"),
    };
}

function findIssueInCommit(lines) {
    for (const line of lines) {
        const trimmedLine = line.trim();
        const issueMatch = issueRegex.exec(trimmedLine);

        if (!issueMatch) {
            continue;
        }

        return {
            repository: issueMatch.groups.repository ?? REPOSITORY_NAME,
            number: issueMatch.groups.number,
            title: issueMatch.groups.title.trim(),
        };
    }

    return null;
}

function createBar(value, maxValue, width = 30) {
    if (maxValue <= 0 || value <= 0) {
        return "░".repeat(width);
    }

    const filledWidth = Math.max(1, Math.round((value / maxValue) * width));
    const emptyWidth = width - filledWidth;

    return "█".repeat(filledWidth) + "░".repeat(emptyWidth);
}

function escapeMarkdown(value) {
    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("|", "\\|")
        .replaceAll("\n", " ");
}

function createIssueLink(issue) {
    if (!issue) {
        return "No issue";
    }

    const issueText = issue.repository === REPOSITORY_NAME
        ? `#${issue.number}`
        : `${issue.repository}#${issue.number}`;

    return `[${issueText}](https://github.com/${issue.repository}/issues/${issue.number})`;
}

function formatDate(value) {
    return new Date(value).toLocaleDateString("cs");
}

function getWorkedOnRange(entries) {
    if (entries.length === 0) {
        return "";
    }

    const timestamps = entries.map((entry) => new Date(entry.commitDate).getTime());
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    const formattedMinDate = formatDate(minDate);
    const formattedMaxDate = formatDate(maxDate);

    if (formattedMinDate === formattedMaxDate) {
        return formattedMinDate;
    }

    return `${formattedMinDate} - ${formattedMaxDate}`;
}

function collectSpendStats() {
    const gitLog = execSync("git log --format=%H%x1f%cI%x1f%an%x1f%B%x1e", {
        encoding: "utf8",
        maxBuffer: 1024 * 1024 * 50,
    });

    const commits = gitLog
        .split("\x1e")
        .map((commit) => commit.trim())
        .filter(Boolean)
        .map(parseCommit)
        .filter(Boolean);

    const totalCommitCount = commits.filter(isCountedCommit).length;

    let totalMinutes = 0;
    let matchCount = 0;

    const entries = [];
    const groups = new Map();

    for (const commit of commits) {
        const lines = commit.body.split(/\r?\n/);
        const issue = findIssueInCommit(lines);
        const groupId = getIssueGroupId(issue);

        for (const line of lines) {
            const trimmedLine = line.trim();
            let spendMatch;

            while ((spendMatch = spendRegex.exec(line)) !== null) {
                const [raw, hoursPart, minutesPart] = spendMatch;

                if (!hoursPart && !minutesPart) {
                    continue;
                }

                const minutes = parseSpendMatch(hoursPart, minutesPart);

                totalMinutes += minutes;
                matchCount += 1;

                if (!groups.has(groupId)) {
                    groups.set(groupId, {
                        issue,
                        totalMinutes: 0,
                        entries: [],
                    });
                }

                const group = groups.get(groupId);

                if (issue?.title && !group.issue?.title) {
                    group.issue = issue;
                }

                const entry = {
                    raw,
                    minutes,
                    formatted: formatMinutes(minutes),
                    line: trimmedLine,
                    issue,
                    groupId,
                    commitHash: commit.hash,
                    commitDate: commit.date,
                    formattedCommitDate: formatDateTime(commit.date),
                };

                entries.push(entry);

                group.totalMinutes += minutes;
                group.entries.push(entry);
            }

            spendRegex.lastIndex = 0;
        }
    }

    return {
        totalMinutes,
        totalCommitCount,
        matchCount,
        entries,
        groups,
    };
}

function createIssueLabel(issue) {
    if (!issue) {
        return "No issue";
    }

    const issueLink = createIssueLink(issue);

    if (!issue.title) {
        return issueLink;
    }

    return `${issueLink} - ${escapeMarkdown(issue.title)}`;
}

function createMarkdownReport(stats) {
    const sortedGroups = [...stats.groups.entries()].sort((a, b) => {
        return b[1].totalMinutes - a[1].totalMinutes;
    });

    const maxGroupMinutes = sortedGroups.reduce((max, [, group]) => {
        return Math.max(max, group.totalMinutes);
    }, 0);

    const generatedAt = new Date().toLocaleString("cs");

    const lines = [];

    lines.push("# Spend report");
    lines.push("");
    lines.push("> This file is generated from Git commit messages containing `/spend ...` entries.");
    lines.push("");
    lines.push(`Generated at: **${generatedAt}**`);
    lines.push("");
    lines.push("## Summary");
    lines.push("");
    lines.push("| Metric | Value |");
    lines.push("| --- | ---: |");
    lines.push(`| Total count | **${formatMinutes(stats.totalMinutes)}** |`);
    lines.push(`| Spend entries / Total commits | ${stats.matchCount} / ${stats.totalCommitCount} (${(stats.matchCount * 100 / stats.totalCommitCount).toFixed(2)}%) |`);
    lines.push(`| Issues with tracked time | ${stats.groups.size} |`); lines.push("");
    lines.push("## Chart by issue");
    lines.push("");
    lines.push("| Issue | Time | Worked on | Chart |");
    lines.push("| --- | ---: | --- | --- |");

    for (const [, group] of sortedGroups) {
        const issueLabel = createIssueLabel(group.issue);
        const bar = createBar(group.totalMinutes, maxGroupMinutes);
        const workedOn = getWorkedOnRange(group.entries);

        lines.push(
            `| ${issueLabel} | **${formatMinutes(group.totalMinutes)}** | ${workedOn} | \`${bar}\` |`,
        );
    }

    lines.push("");
    return lines.join("\n");
}

function printConsoleSummary(stats) {
    console.log("Spend statistics");
    console.log("================");
    console.log(`Matches found: ${stats.matchCount}`);
    console.log(`Total minutes: ${stats.totalMinutes}`);
    console.log(`Total time:    ${formatMinutes(stats.totalMinutes)}`);
    console.log(`Report file:   ${OUTPUT_FILE}`);
}

function main() {
    const stats = collectSpendStats();
    const report = createMarkdownReport(stats);

    writeFileSync(OUTPUT_FILE, report, "utf8");
    printConsoleSummary(stats);
}

main();