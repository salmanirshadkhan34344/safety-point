import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useRecoilState } from 'recoil';

import { apiGetAuth, apiPost } from '../util/ApiRequest';
import { ENDPOINTS } from '../util/EndPoint';
import { isLoaderState } from '../util/RecoilStore';


const PrivacyPolicy = () => {

  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);


  useEffect(() => {
    getHeaderData();
  }, []);



  const [appContent, setAppContent] = useState({
    terms_and_services: '',
    privacy_policy: '',
    editable: ''
  });

  const getHeaderData = () => {
    apiGetAuth(
      ENDPOINTS.DashboardInfo,
      (res) => {
        setAppContent(prevState => ({
          ...prevState,
          about_us: res?.app_content?.about_us,

        }));

        setAppContent(prevState => ({
          ...prevState,
          privacy_policy: res?.app_content?.privacy_policy,
        }));

        setAppContent(prevState => ({
          ...prevState,

          terms_and_services: res?.app_content?.terms_and_services,
        }));
      },
      (error) => {
        console.log(error)
      }
    );
  };



  const handleUpdateContent = (updateKey) => {
    setIsLoaderInfo(true)
    let updateValue = '';
    if (updateKey == 'about_us') { updateValue = appContent.about_us }
    if (updateKey == 'terms_and_services') { updateValue = appContent.terms_and_services }
    if (updateKey == 'privacy_policy') { updateValue = appContent.privacy_policy }
    apiPost(
      ENDPOINTS.UpdateContent,
      {
        update_key: updateKey,
        update_value: updateValue
      },
      (res) => {
        setIsLoaderInfo(false)
        getHeaderData()
        setAppContent(prevState => ({
          ...prevState,
          editable: '',
        }));
      },
      (error) => {
        setIsLoaderInfo(false)
        console.log(error)
      }
    );
  }




  return (
    <>
      <Container fluid className="mt-4">
        <Row className='mt-4'>
          <Col md={12} className='mb-3'>
            <div className="mt-2 card-header-customs ">
              <Card >
                <Card.Body>
                  <Card.Title>Privacy Policy</Card.Title>
                  <CKEditor
                    disabled={appContent.editable == 'privacy_policy' ? false : true}
                    editor={ClassicEditor}
                    data={appContent?.privacy_policy}
                    onReady={editor => {
                      console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();

                      setAppContent(prevState => ({
                        ...prevState,
                        privacy_policy: data,

                      }));
                      console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                      console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                      console.log('Focus.', editor);
                    }}
                  />
                  <Button variant="primary" className='mt-2' onClick={() => {
                    if (appContent.editable != 'privacy_policy') {
                      setAppContent(prevState => ({
                        ...prevState,
                        editable: 'privacy_policy',
                      }));
                    }
                    if (appContent.editable == 'privacy_policy') {
                      handleUpdateContent('privacy_policy')
                    }


                  }} >{appContent.editable == 'privacy_policy' ? 'Update' : 'Edit'}</Button>
                </Card.Body>
              </Card>
            </div >
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
