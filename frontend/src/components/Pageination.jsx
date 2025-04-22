import React from "react";

const Pageination = ({
  noOfPages,
  currentPage,
  handlePageChange,
  handleNextPageChange,
  handlePrevPageChange,
}) => {
  return (
    <div className="fixed top-[500px] left-1/2 p-4 transform -translate-x-1/2">
      <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePrevPageChange()}
          className={`${
            currentPage === 0 ? "hidden" : ""
          } text-2xl sm:text-3xl p-3 sm:p-5 m-2 text-black hover:text-gray-900 hover:border-gray-400`}
        >
          ◀
        </button>
        {[...Array(noOfPages).keys()].map((n) => (
          <button
            onClick={() => handlePageChange(n)}
            key={n}
            className={`border-2 border-gray-400 p-3 sm:p-5 m-2 text-black text-sm sm:text-base ${
              currentPage === n ? "bg-black text-white" : ""
            } hover:text-gray-900 hover:border-gray-400`}
          >
            {n + 1}
          </button>
        ))}
        <button
          onClick={() => handleNextPageChange()}
          className={`${
            currentPage === noOfPages - 1 ? "hidden" : ""
          } text-2xl sm:text-3xl p-3 sm:p-5 m-2 text-black hover:text-gray-900 hover:border-gray-400`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Pageination;
