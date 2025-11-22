
const TableSkeleton = ({ rows = 5, columns = 7 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <span className="placeholder col-12 placeholder-glow"></span>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;

