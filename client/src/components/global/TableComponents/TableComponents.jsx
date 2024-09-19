import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import ReactPaginate from "react-paginate";
import { useRecoilState } from "recoil";
import { isLoaderState } from "../../../util/RecoilStore";
import { apiPost } from "../../../util/ApiRequest";



const TableComponents = ({ title, endPoint, headers, reloadData, searchObject, }) => {
  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);


  const [items, setItems] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [totalPage, setTotalPage] = useState(0);



  useEffect(() => {
    const url = "";
    setCurrentUrl(url);
    getPaginatedUsers(url);
  }, [reloadData]);

  const handlePageClick = (item) => {
    const url = `?page=${item.selected + 1}&limit=10`;
    getPaginatedUsers(url);
  };

  const getPaginatedUsers = (url) => {
    setIsLoaderInfo(true);
    apiPost(
      endPoint + url,
      searchObject,
      (res) => {
        setItems(res?.data?.results);
        setTotalPage(res?.data?.meta?.totalPages);
        setIsLoaderInfo(false);
      },
      (error) => {
        console.log(error);
        setIsLoaderInfo(false);
      }
    );
  };




  return (
    <>
      <div className="my-dataTable">
        <div className="table-main-header bg-primary p-2">
          <h5 className="my-auto text-white  p-2">{title}</h5>
        </div>
        <div className="table-responsive">
          <DataTable
            className=""
            columns={headers}
            data={items}
            pointerOnHover
            striped
            dense={false}
          />

        </div>


      </div >
      <ReactPaginate
        autoWidth
        className="pagination-custom mt-4"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={10}
        pageCount={totalPage}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
};

TableComponents.defaultProps = {
  title: "default title",
  endPoint: "",
  headers: [],
  reloadData: false,
  searchObject: {},
};

export default TableComponents;
