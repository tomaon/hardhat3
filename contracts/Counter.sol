// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  uint public x; // -> 自動で getter が作られる

  event Increment(uint by);

  error InvalidIncrement(uint value);

  constructor(uint initialValue) {
    x = initialValue;
  }

  // inc() と incBy() のガス代の差（約 17,500 gas）は、引数を持つことによる calldata のコストです：
  //
  // Calldata コスト:
  // - inc() は引数なしなので、関数セレクタ（4 bytes）だけ
  // - incBy(uint) は uint256 引数（32 bytes）を calldata に含める必要がある
  // - 32 bytes の calldata コスト ≈ 32 × 16 gas = 512 gas （non-zero bytes の場合）
  //
  // ABI デコードコスト:
  // - 引数がある場合、EVM は calldata から引数をデコードする処理が必要
  // - これには CALLDATALOAD, AND, その他の opcodes が使われる
  // - このオーバーヘッドが約 17,000 gas
  //
  // revert のコスト:
  // - わずか 23 gas しか変わらないので、ほぼ無視できる

  //      | Min   | Average │ Median │ Max   │ #calls
  // x++  │ 27674 │ 36224   │ 36224  │ 44774 │ 4
  // x+=1 │ 27731 │ 36281   │ 36281  │ 44831 │ 4
  function inc() public {
    // x++;
    // emit Increment(1);
    incBy(1); // size が 1455->1184 で gas も 290326-> 231675 に
  }

  //         | Min   | Average │ Median │ Max   │ #calls
  // x += by │ 45148 │ 45148   │ 45148  │ 45148 │ 1
  function incBy(uint by) public {
    // custom error の方が安い,らしいが手元では差がない
    // require(by > 1, "incBy: increment must be greater than 1");
    // if (by <= 1) revert InvalidIncrement(by);

    x += by;
    emit Increment(by);
  }
}
