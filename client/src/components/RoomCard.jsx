import { PropTypes } from "prop-types";
import { Card, Button, Form, Modal, Input } from 'antd';
import { useContext, useState } from "react";
import MainContext from "../services/contexts/MainContext";
import { useNavigate } from "react-router-dom"
function RoomCard({roomData}) {
  let navigate = useNavigate()
  let {socket} = useContext(MainContext)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    if(values.password===roomData.roomPassword){
      socket.emit("joinRoom",{roomId:roomData._id,username:values.username})
      navigate("/room/"+roomData._id)
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Card
      title={roomData.roomName}
      extra={<Button type="primary" disabled={roomData.maxPlayer>roomData.players.length?false:"disabled"} onClick={showModal} >Join</Button>}
      style={{width:"100%"}}
      >
        <p>{roomData.players.length}/{roomData.maxPlayer}</p>
      </Card>
      <Modal destroyOnClose={true} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form
                name="basic"
                labelCol={{
                span: 6,
                }}
                wrapperCol={{
                span: 16,
                }}
                style={{
                maxWidth: 600,
                margin:"100px 0"
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                label="User Name"
                name="username"
                rules={[
                    {
                    required:true,
                    message: 'Please input your user name!',
                    },
                    {
                    min:3,
                    message: 'Room name must be more than 3 characters!',
                    },
                ]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                label="Room Password"
                name="password"
                rules={[
                    {
                    required:true,
                    message: 'Please input room password!',
                    }
                ]}
                >
                <Input.Password />
                </Form.Item>


                <Form.Item
                wrapperCol={{
                    offset:6,
                    span: 24,
                }}
                >
                  <Button type="primary" htmlType="submit">
                      Create
                  </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
  )
}


RoomCard.propTypes = {
  roomData: PropTypes.object
};

export default RoomCard
