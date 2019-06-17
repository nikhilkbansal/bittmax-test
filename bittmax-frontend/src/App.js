import React from 'react';
import './App.css';
import { Table, Container, Row, Col, Button } from 'reactstrap';
import { AreaChart } from 'react-chartkick'
import 'chart.js';


function DataTable({ data, reverseOrder, type }) {
  const priceClassName = type === 'buy' ? 'buyingDigits' : 'sellingDigits';
  const chartColor = type === 'sell' ? '#fd6f6c' : '#a4f9c8';
  const chartData = reverseOrder ? { "2017-01-01": 34, "2017-01-02": 13, "2017-01-04": 2 } : { "2017-01-01": 4, "2017-01-02": 15, "2017-01-03": 27 };
  return (
    <div>
      <div className='chartContainer'>
        <AreaChart
          library={{
            scales: {
              xAxes: [{
                display: false
              }],
              yAxes: [{
                display: false
              }],
            }
          }}
          curve={false}
          colors={[chartColor]} legend={false} data={chartData} />
      </div>
      <Table>
        <thead>
          <tr>
            <th>{reverseOrder ? 'Price' : 'Sum'}</th>
            <th>Quantity</th>
            <th>{reverseOrder ? 'Sum' : 'Price'}</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map(o => <tr>
              <td className={reverseOrder ? priceClassName : ''}>{reverseOrder ? o.price : o.sum}</td>
              <td>{o.quantity}</td>
              <td className={!reverseOrder ? priceClassName : ''}>{reverseOrder ? o.sum : o.price}</td>
            </tr>)
          }
        </tbody>
      </Table>

    </div>
  )
}

function DataTableHeader({ type, name, total }) {
  return (
    <Col xs="4">
      <p>{type === 'sell' ? 'SELLING' : 'BUYING'} {name}</p>
      <p><b>TOTAL</b>: {total}</p>
    </Col>);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'buyingFirst',
      data: {}
    }

  }

  componentDidMount() {
    this.getData()
  }

  getCumulative = (obj) => {
    obj.data[0].sum = obj.data[0].quantity
    for (let i = 1; i < obj.data.length; i++) {
      obj.data[i].sum = obj.data[i - 1].sum + obj.data[i].quantity
    }
    obj.total = obj.data[obj.data.length - 1].sum;
    return obj;
  }

  getData = () => {
    fetch('http://localhost:3001/')
      .then((response) => response.json())
      .then((data) => {

        fetch('http://localhost:3001/data/', {
          headers: {
            authorization: data.token
          },
        })
          .then((response) => response.json())
          .then((data) => {


            data.buying = this.getCumulative(data.buying);
            data.selling = this.getCumulative(data.selling);
            this.setState({ data });
          });

      });
  }

  toggleOrder = () => {
    const { order } = this.state;
    const newOrder = order === 'sellingFirst' ? 'buyingFirst' : 'sellingFirst';
    this.setState({ order: newOrder });
  }

  render() {
    const { order, data } = this.state;
    const leftData = order === 'buyingFirst' ? data.buying : data.selling;
    const rigthData = order === 'buyingFirst' ? data.selling : data.buying;
    return (
      <div className="App" style={{ color: '#eeeeed' }}>
        {leftData && rigthData && <Container>
          <Row>
            <Col xs="4">
              <DataTableHeader type={order === 'buyingFirst' ? 'buy' : 'sell'} name='Bitcoin' total={leftData.total} />
            </Col>
            <Col xs="4">
              <Button color="link" onClick={() => this.toggleOrder()} ><img style={{ margin: 'auto', width: '30px', height: '30px' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiAwoNNg1AMPQGAAACA0lEQVRo3u2ZsUvDQBTGv5dKoSA4qoNuTh1MRRDERdDZSdFFUOoiFFr0D3ATB21AcFE6dVD8ExxcpFSQpouTa7F2UxCEoj2XWtqmuaTJ651Dv0zl0vt++fIuHO8ARpU27aJdLG1yztmH7KwtmlfW/7+Izx7ptp9WIqMUoMu+DwSDxf7IYQ+k/b0IhgSexiIVjPYc8pECQwKRJRd7XykwAETvUHMd9ERgAIjX6RAiKAJLEZp5SgZFYPsOlHfFlWQ213JkAwiKwAgQDIGlBv5k5uhAMtyzFlgBALqVDvdAYAW4H2mseNziQKBCLJZCGpO8SUjVUQtGLIUTpfZdKZD9qti+KwVDi31bCsyroH8EfQBNBLJF+JmCS2xpBsCjgYJWABh0jIY+ezojwJ7BvtCwGOmNLs1nfQ8/1FBDDfVfREA5LvbEhAbrKi4SL1TeEDfaHr9Ba2QXsaANACjo3JIBwKIhLL0Extw1tCIQ0LPLpxZAJ0KrnaAJodpaBYmMllqwOhoqilOowvo67+ro+EDYec8vf/NROFpKXgjG1GyFMwbHl9CrFsQ6p71Lm06agqCkmRswgEoE17aiKgRJp1QNgrRV64GwbeYHDOCBUItOx+thATw2JNJFOV5fDZ+A545IgvD586AAQIJwOv8RHsDneUHwg0kmgOBHs4wKdjjNqkEcz/8C8pS5rJZXovMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDMtMTBUMTM6NTQ6MTMrMDE6MDD6TcjDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAzLTEwVDEzOjU0OjEzKzAxOjAwixBwfwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=">
              </img></Button>
            </Col>
            <DataTableHeader type={order === 'buyingFirst' ? 'sell' : 'buy'} name='Bitcoin' total={rigthData.total} />
          </Row>
          <Row>
            <Col xs="6">
              <DataTable data={leftData.data} type={order === 'buyingFirst' ? 'buy' : 'sell'} />
            </Col>
            <Col xs="6">
              <DataTable data={rigthData.data} reverseOrder type={order === 'buyingFirst' ? 'sell' : 'buy'} />
            </Col>
          </Row>
        </Container>}
      </div>
    );
  }
}

export default App;
