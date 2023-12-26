import { PropTypes } from "prop-types";
import { Card, Button } from 'antd';

function RoomCard({roomData}) {
  console.log(roomData);
  return (
    <>
      <Card
      title={roomData.roomName}
      extra={<Button type="primary" >Join</Button>}
      style={{width:"100%"}}
      >
        <p>0/{roomData.maxPlayer}</p>
      </Card>
    </>
  )
}


RoomCard.propTypes = {
  roomData: PropTypes.object
};

export default RoomCard
