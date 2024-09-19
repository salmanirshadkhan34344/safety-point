import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { useRecoilState } from "recoil";
import { apiGetAuth } from "../../util/ApiRequest";
import { ENDPOINTS } from "../../util/EndPoint";
import { isLoaderState } from "../../util/RecoilStore";
import SingleHeaderCard from "./Header/SingleHeaderCard";





const HeaderCard = () => {

  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);

  const [headerData, setHeaderData] = useState({

    user_count: 0,
    reporting_count: 0,
  });

  useEffect(() => {
    getHeaderData();
  }, []);

  const getHeaderData = (url) => {
    setIsLoaderInfo(true);
    apiGetAuth(
      ENDPOINTS.DashboarCardHeader,
      (res) => {
        setHeaderData({
          user_count: res?.user_count?res?.user_count:0,
          reporting_count:  res?.reporting_count?res?.reporting_count:0,
        })
        setIsLoaderInfo(false);
      },
      (error) => {
        console.log(error)
        setIsLoaderInfo(false);

      }
    );
  };
  return (
    <>
      <Container fluid className="mt-2 card-header-customs">
        <Row>
          <Col xl="4" lg="6" md="12">
           < SingleHeaderCard type="Users" count={headerData?.user_count} icon={<FaUsers  size={28}/>}/>
          </Col>
          <Col xl="4" lg="6" md="12">
           < SingleHeaderCard  type="Incidents"  count={4} icon={<RiLoginCircleLine   size={28}/>}/>
          </Col>
          <Col xl="4" lg="6" md="12">
           < SingleHeaderCard  type="Reports"  count={headerData?.reporting_count} icon={<TbReportSearch  size={28}/>}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HeaderCard;
