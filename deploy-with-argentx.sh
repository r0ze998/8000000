#!/bin/bash

echo "=== ArgentX Account Deploy Helper ==="
echo ""
echo "このスクリプトはArgentXアカウントのデプロイ状態を確認します"
echo ""

# Starknet Sepolia RPC
RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

# アドレス
ADDRESS="0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E"

echo "チェック中のアドレス: $ADDRESS"
echo ""

# 別のRPCエンドポイントも試す
echo "1. Public RPC で確認..."
/Users/r0ze/.starkli/bin/starkli account fetch $ADDRESS --rpc $RPC 2>&1 | grep -E "Error|Account"

echo ""
echo "2. Alchemy RPC で確認..."
ALCHEMY_RPC="https://starknet-sepolia.g.alchemy.com/v2/demo"
/Users/r0ze/.starkli/bin/starkli account fetch $ADDRESS --rpc $ALCHEMY_RPC 2>&1 | grep -E "Error|Account"

echo ""
echo "もしどちらも「ContractNotFound」の場合："
echo "1. ArgentXで画面を更新（Command+R または Ctrl+R）"
echo "2. ネットワークをMainnetに切り替えて、再度Sepoliaに戻す"
echo "3. もう一度自分宛に0.000001 ETHを送信"
echo ""
echo "または、新しいアカウントを作成することも可能です："
echo "ArgentX → 左上のアカウント名 → 「+ Add account」"