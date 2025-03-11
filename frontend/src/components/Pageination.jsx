import React from "react";

const Pageination = ({
  noOfPages,
  currentPage,
  handlePageChange,
  handleNextPageChange,
  handlePrevPageChange,
}) => {
  return (
    <div className="fixed top-[500px] left-1/2 p-4 ">
      <div className="flex p-2 justify-center items-center ">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePrevPageChange()}
          className={` ${
            currentPage === 0 ? "hidden" : ""
          } text-2xl p-5 m-4 text-black hover:text-gray-900 hover:border-gray-400`}
        >
          ◀
        </button>
        {[...Array(noOfPages).keys()].map((n) => (
          <button
            onClick={() => handlePageChange(n)}
            key={n}
            className={`border-2 border-gray-400 p-5 m-4 text-black ${
              currentPage === n ? "bg-black text-white" : ""
            } hover:text-gray-900 hover:border-gray-400 `}
          >
            {n + 1}
          </button>
        ))}
        <button
          onClick={() => handleNextPageChange()}
          className={` ${
            currentPage === noOfPages - 1 ? "hidden" : ""
          } text-2xl p-5 m-4 text-black hover:text-gray-900 hover:border-gray-400`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Pageination;
