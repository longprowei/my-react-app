import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = "square " + props.class;
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        class={this.props.line ? (this.props.line.includes(i) ? 'highlight' : '') : ''}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    
    for (let i = 0; i < 3; i++) {
      let rows = [];
      for (let j = 0; j < 3; j++) {
        rows.push(this.renderSquare(i * 3 + j));
      }
      squares.push((
        <div className="board-row">
          {rows}
        </div>
      ));
    }
    return (
      <div>
        {squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      location: Array(9).fill(null),
    }
  }

  classMark() {
    const items = document.querySelectorAll('.game-info ol li');
    for(let item of items) {
      item.classList.remove('current-item');
    }
  }

  markCurrentItem(step) {
    const currentItem = document.querySelector(`.game-info ol li:nth-child(${step + 1})`);
    currentItem.classList.add('current-item');
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = this.state.location.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    location[this.state.stepNumber] = {
      row: parseInt(i / 3),
      col: parseInt(i % 3),
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.classMark();
    this.setState({
      history: history.concat({
        squares: squares,
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      location: location,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
    this.classMark();
    this.markCurrentItem(step);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerObj = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ` (${this.state.location[move - 1].col}, ${this.state.location[move - 1].row})`:
        'Go to start';
      return (
        <li key={move} className={move === history.length - 1 ? 'current-item' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winnerObj) {
      const winner = winnerObj.winner;
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            line={winnerObj ? winnerObj.line : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

//========================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      }
    }
  }
  return null;
}
