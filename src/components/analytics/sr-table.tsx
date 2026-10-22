type Props = {
  caption: string;
  headers: readonly string[];
  /** Each row's first cell is its row header and must be unique. */
  rows: readonly (readonly string[])[];
};

/**
 * Screen-reader twin of a chart: the same numbers as a real table. Render inside a `relative` parent.
 * sr-only sits on a wrapper: a <table> ignores width:1px and would widen the page on mobile.
 */
export function SrTable({ caption, headers, rows }: Props) {
  return (
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([rowHeader, ...cells]) => (
            <tr key={rowHeader}>
              <th scope="row">{rowHeader}</th>
              {cells.map((cell, index) => (
                // Columns are fixed per table, so the position is a stable key.
                <td key={headers[index + 1] ?? index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
