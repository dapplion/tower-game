import React from "react";

export default class MyDrizzleApp extends React.Component {
  state = { dataKey: null };

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.TowerGame;

    // get and save the key for the variable we are interested in
    const dataKey = contract.methods["storedData"].cacheCall();
    this.setState({ dataKey });
  }

  render() {
    const { TowerGame } = this.props.drizzleState.contracts;
    const storedData = TowerGame.storedData[this.state.dataKey];
    return <div>
        <h1>{JSON.stringify(storedData.value)}</h1>
        <h4>{JSON.stringify(storedData)}</h4>
    </div>;
  }
}