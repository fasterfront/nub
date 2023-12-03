import DiffMatchPatch from 'diff-match-patch'
import { db } from 'db'

export function linesDiff(oldText: string, newText: string) {
  const dmp = new DiffMatchPatch()
  const { chars1, chars2, lineArray } = dmp.diff_linesToChars_(oldText, newText)
  const diffs = dmp.diff_main(chars1, chars2, false)
  dmp.diff_charsToLines_(diffs, lineArray)

  return diffs.flatMap((diff) =>
    diff[1]
      .split('\n')
      .slice(0, -1)
      .map(() => diff[0]),
  )
}

export function getFileChangesSinceCommentsWasMade(comment: Comment) {
  const diff = linesDiff(comment.originalFile.content, comment.file.content)

  let [currentOld, currentNew] = [0, 0]
  return diff.reduce<[number | undefined, number | undefined][]>(
    (acc, type) => {
      acc.push([
        type >= 0 ? currentOld++ : undefined,
        type <= 0 ? currentNew++ : undefined,
      ])
      return acc
    },
    [],
  )
}

export function wasFileChangedWhereCommentWasMade(comment: Comment) {
  const changes = getFileChangesSinceCommentsWasMade(comment)
  return changes.some(
    ([originalLine, newLine]) =>
      originalLine !== undefined &&
      originalLine >= comment.lineStart &&
      originalLine <= comment.lineEnd &&
      newLine === undefined,
  )
}

const query = db.query.comment
  .findMany({
    where: (comment, { eq, sql }) =>
      eq(comment.nubId, sql.placeholder('nubId')),
    columns: {
      lineStart: true,
      lineEnd: true,
    },
    with: {
      file: {
        columns: {
          content: true,
        },
      },
      originalFile: {
        columns: {
          content: true,
        },
      },
    },
  })
  .prepare()

type Comment = ReturnType<(typeof query)['all']>[number]
