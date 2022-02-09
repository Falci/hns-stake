node addr: rs1qk7u8dm07ljyzpk29etpl5cj5lpfftj8ketxmvj
node2: rs1q5htjnf2q4lgyyckczp9kmhj0wnp89tuzclxlwn
wallet: rs1q3plnt5dare9yjzqfuy9g9gknt0ku7npc7ju9j5

alias hsd-cli='/Users/fernando.falci/workspace/falci/hns/hsd/bin/hsd-cli --port 14138 --api-key=api-key --network=regtest'
alias hsw-cli='/Users/fernando.falci/workspace/falci/hns/hsd/bin/hsw-cli --port 14138 --api-key=api-key --network=regtest'

# mine block

hsd-cli rpc generatetoaddress 1 `hsw-cli --account=default address | jq '.address' -r`
hsd-cli rpc generatetoaddress 1 rs1qk7u8dm07ljyzpk29etpl5cj5lpfftj8ketxmvj

# pay

hsw-cli send --id=primary --value=1000 --address=rs1q3plnt5dare9yjzqfuy9g9gknt0ku7npc7ju9j5

txid: da2392183c53286cb6d778d6a987ab199f5d8de0341491a106623809febe62ad
hash: da2392183c53286cb6d778d6a987ab199f5d8de0341491a106623809febe62ad
