import { Modal, Form, Button, Input, Select } from 'antd';
import { useContext } from 'react';
import MainContext from '../services/contexts/MainContext';
import { addRoom } from '../services/api/roomRequests';
function CreateRoom() {
    const {isAddRoomModalOpen,setIsAddRoomModalOpen,handleAddRoomCancel,handleAddRoomOk} = useContext(MainContext)
    const { Option } = Select;
    const onFinish = (values) => {
        let roomParams={
          roomName:values.roomName,
          roomPassword:values.roomPassword,
          maxPlayer:values.maxPlayer
        }
        addRoom(roomParams)
        .then((data)=>{
          console.log(data);
          setIsAddRoomModalOpen(false)
        })
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
  return (
    <>
        <Modal destroyOnClose={true} title="Basic Modal" open={isAddRoomModalOpen} onOk={handleAddRoomOk} onCancel={handleAddRoomCancel} footer={null}>
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
                label="Room Name"
                name="roomName"
                rules={[
                    {
                    required:true,
                    message: 'Please input your room name!',
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
                name="roomPassword"
                rules={[
                  {
                    required:true,
                    message: 'Please input your password!',
                    },
                    {
                    pattern:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/g,
                    message: 'Password must contain 0ne letter and one number and must be more than 6 character!',
                    },
                ]}
                >
                <Input.Password/>
                </Form.Item>

                <Form.Item name="maxPlayer" label="Max Player" rules={[{ required: true }]}>
                    <Select
                    placeholder="Select a max player"
                    allowClear
                    >
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                    <Option value={11}>11</Option>
                    <Option value={12}>12</Option>
                    <Option value={13}>13</Option>
                    <Option value={14}>14</Option>
                    <Option value={15}>15</Option>
                    <Option value={16}>16</Option>
                    <Option value={17}>17</Option>
                    <Option value={18}>18</Option>
                    <Option value={19}>19</Option>
                    <Option value={20}>20</Option>
                    <Option value={21}>21</Option>
                    <Option value={22}>22</Option>
                    <Option value={23}>23</Option>
                    <Option value={24}>24</Option>
                    <Option value={25}>25</Option>
                    </Select>
                </Form.Item>

                {/* <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required:true,
                    message: 'Please input your email!',
                    },
                    {
                    pattern:/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: 'Please input valid email!',
                    },
                ]}
                >
                <Input />
                </Form.Item> */}

                {/* <Form.Item
                label="Avatar"
                name="avatar"
                rules={[
                  {
                    max:150,
                    message: 'Avatar must be less than 150 characters!',
                  },
              ]}
                >
                <Input />
                </Form.Item> */}
{/* 
                <Form.Item
                label="Bio"
                name="bio"
                rules={[
                    {
                    max:150,
                    message: 'Bio must be less than 150 characters!',
                    },
                ]}
                >
                <Input />
                </Form.Item> */}

                {/* <Form.Item
                label="Fullname"
                name="fullname"
                rules={[
                    {
                    max:40,
                    message: 'Fullname must be less than 40 characters!',
                    },
                ]}
                >
                <Input />
                </Form.Item> */}

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

export default CreateRoom
