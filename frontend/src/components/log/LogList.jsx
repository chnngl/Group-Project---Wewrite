const LogList = ({ logs, page, totalPages, onPageChange }) => {
  return (
    <div className="overflow-x-auto text-center">
      <table className="min-w-full border-collapse border border-gray-450 text-center">
        <thead>
          <tr className="bg-gray-600 text-white">
            <th className="p-2 border text-center w-1/3">Email</th>
            <th className="p-2 border text-center w-1/3">Action</th>
            <th className="p-2 border text-center w-1/3">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => {
            return (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"
                } hover:bg-gray-100`}
              >
                <td className="p-2 border text-center">{log.email}</td>
                <td className="p-2 border text-center">
                  {String(log.action).toLowerCase()} this story at
                </td>
                <td className="p-2 border text-center">{log.timestamp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogList;
