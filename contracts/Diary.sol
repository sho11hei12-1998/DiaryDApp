pragma solidity ^0.5.0;

contract DiaryApp {
    address owner; // コントラクトオーナーのアドレス
    bool public stopped; // trueの場合，全てのコントラクトが使用不可能になる
    uint256 public numItems; // 全体の投稿数
    uint256 public total_entry; // eth還元キャンペーンに応募した総数
    uint256 public bonus_eth; // 集まったetherの合計

    // コンストラクタ
    constructor() public {
        owner = msg.sender; // コントラクトをデプロイしたアドレスをオーナーに指定する
        stopped = false;
        numItems = 0;
        total_entry = 0;
        bonus_eth = 0;
    }

    // 呼び出しがコントラクトのオーナーか確認
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // 呼び出しがアカウント登録済みのEthアドレスか確認
    modifier onlyUser {
        require(accounts[msg.sender].resistered);
        _;
    }

    // ===========================
    // 取引を行うためのステートと関数
    // ===========================

    // アカウント情報
    struct account {
        string name; //名前
        string email; //Emailアドレス
        bool resistered; //アカウント未登録:false, 登録済み:true
        uint256 numWrite; //投稿数
        bool entryed; // エントリーまだならfalse, 済みならtrue
    }

    address[] public users; // ユーザーのアドレス

    mapping(address => account) accounts;

    // アカウントを登録する関数
    function registerAccount(string memory _name, string memory _email)
        public
        returns (bool)
    {
        //アカウントが登録されていなければ新規会員登録をする
        if (!isUserExist(msg.sender)) {
            accounts[msg.sender].resistered = true;
            users.push(msg.sender);
        }
        accounts[msg.sender].name = _name;
        accounts[msg.sender].email = _email;
        return true;
    }

    // アカウントが登録されているかどうかを確認
    function isUserExist(address user) public view returns (bool) {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == user) {
                return true;
            }
        }
        return false;
    }

    // アカウント情報
    function viewAccount(address user)
        public
        view
        returns (
            string memory,
            string memory,
            uint256
        )
    {
        string memory _name = accounts[user].name;
        string memory _email = accounts[user].email;
        uint256 _numWrite = accounts[user].numWrite;

        return (_name, _email, _numWrite);
    }

    // 投稿記事情報
    struct item {
        address payable sellerAddr; // 投稿者のEthアドレス
        string title; // 日記のタイトル
        string text; // 日記の本文
        uint256 time; //投稿時刻
        bool favorite; // お気に入り
        bool stopSell; // false:出品中, true:出品取消し
    }
    mapping(uint256 => item) public items;

    // 商品画像の在り処
    // solidityの構造体は12個までしかメンバを持てない.
    struct image {
        string googleDocID; // googleドライブのファイルのid
    }
    mapping(uint256 => image) public images;

    // 出品する関数
    function submit(
        string memory _title,
        string memory _text,
        string memory _googleDocID
    ) public payable onlyUser isStopped {
        uint256 _time = block.timestamp;

        items[numItems].sellerAddr = msg.sender; // 投稿者のEthアドレス
        items[numItems].title = _title; // タイトル
        items[numItems].text = _text; // 本文
        items[numItems].time = _time; // 投稿時刻
        images[numItems].googleDocID = _googleDocID; // googleドライブのファイルid
        bonus_eth += msg.value;
        accounts[msg.sender].numWrite++; // 各アカウントが投稿した記事数の更新
        numItems++; // 出品されている商品数を１つ増やす
    }

    // お気に入り登録
    function favo_true(uint256 _num) public onlyUser isStopped {
        items[_num].favorite = true;
    }

    // お気に入り解除
    function favo_false(uint256 _num) public onlyUser isStopped {
        items[_num].favorite = false;
    }

    // ================
    // Eth還元キャンペーン
    // ================

    // eth還元キャンペーンにエントリーしたアカウント
    struct get_eth_account {
        address payable entryAddr; // エントリーしたアカウントのEthアドレス
        string name; //名前
        string email; //Emailアドレス
    }

    mapping(uint256 => get_eth_account) public get_eth_accounts;

    // eth_getキャンペーンにエントリーする関数
    function entry_get_eth() public onlyUser isStopped {
        // 応募条件
        require(!accounts[msg.sender].entryed);
        require(accounts[msg.sender].numWrite >= 1); // 投稿回数が1以上

        get_eth_accounts[total_entry].entryAddr = msg.sender; //
        get_eth_accounts[total_entry].name = accounts[msg.sender].name; //
        get_eth_accounts[total_entry].email = accounts[msg.sender].email; //
        accounts[msg.sender].entryed = true;
        total_entry++;
    }

    // アカウントの取引回数、エントリー確認を行う
    function view_eth_acc(address user) public view returns (uint256, bool) {
        uint256 _entry_condition1 = accounts[user].numWrite;
        bool _entry_condition2 = accounts[user].entryed;

        return (_entry_condition1, _entry_condition2);
    }

    // 乱数生成
    function random() internal view returns (uint256) {
        uint256 randnum = block.timestamp % total_entry;

        return uint256(randnum);
    }

    // 当選者の選定とethの送金処理
    function get_eth() public payable onlyOwner isStopped {
        require(bonus_eth >= 1 ether);

        uint256 idx = random();
        get_eth_accounts[idx].entryAddr.transfer(bonus_eth);
        bonus_eth = 0;
        total_entry = 0;
        entry_false();
    }

    // 全てのアカウントのエントリー状態をfalseにする
    function entry_false() internal onlyOwner isStopped returns (uint256) {
        for (uint256 i = 0; i < users.length; i++) {
            address index = users[i];
            if (accounts[index].entryed) {
                accounts[index].entryed = false;
            }
        }
    }

    // ================
    // セキュリティー対策
    // ================

    // Circuit Breaker
    modifier isStopped {
        require(!stopped);
        _;
    }

    // Circuit Breakerを発動，停止する関数
    function toggleCircuit(bool _stopped) public onlyOwner {
        stopped = _stopped;
    }

    // コントラクトを破棄して，残金をオーナーに送る関数
    // クラッキング対策
    // function kill() public onlyOwner {
    //     selfdestruct(owner);
    // }
}
