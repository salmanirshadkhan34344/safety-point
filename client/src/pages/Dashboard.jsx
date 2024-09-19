import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ReportingYearBar from "../components/charts/ReportingYearBar";
import UsersYearBar from "../components/charts/UsersYearBar";



const Dashboard = () => {



  return (
    <>
      <Container fluid className="mt-4">
        <Row>
          <Col md={6} className="mb-4" >
            <Card>
              <UsersYearBar />
            </Card>
          </Col>
          <Col md={6} className="mb-4" >
            <Card>
              <ReportingYearBar />
            </Card>
          </Col>
          </Row>
      </Container >
    </>
  );
};

export default Dashboard;
