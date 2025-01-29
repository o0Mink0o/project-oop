public class Node {
    private Player ownby;
    private Minion Isminion;
    protected static Node[][] board=new Node[8][8];

    public Node() {

    }

    public Node(Player ownby) {
        this.ownby = ownby;
    }


    public Player getOwnby() {
        return ownby;
    }

    public void setOwnby(Player ownby) {
        this.ownby = ownby;
    }

    public Minion getIsminion() {
        return Isminion;
    }

    public void setIsminion(Minion isminion) {
        Isminion = isminion;
    }

    public boolean canbuy(Player player) {
        if(ownby!=null){
            return false;
        }
        int xy = this.getPosition(),x=xy/10, y=xy%10;
        if(x>0){
            if(Node.board[x-1][y].ownby==player){
                return true;
            }
        }
        if(y>0){
            if(Node.board[x][y-1].ownby==player){
                return true;
            }
        }
        if(x<8){
            if(Node.board[x+1][y].ownby==player){
                return true;
            }
        }
        if(y<8){
            if(Node.board[x][y+1].ownby==player){
                return true;
            }
        }
        if(y%2==0){
            if(x!=7){
                if (Node.board[x + 1][y + 1].ownby == player) {
                    return true;
                }
                if(y!=0){
                    if(Node.board[x+1][y-1].ownby==player){
                        return true;
                    }
                }

            }
        }else{
            if(x!=0){
                if (Node.board[x - 1][y - 1].ownby == player) {
                    return true;
                }
                if(y!=7){
                    if(Node.board[x-1][y+1].ownby==player){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public int getPosition() {
        for(int i=0;i<8;i++){
            for(int j=0;j<8;j++){
                if(board[i][j]==this){
                    return i*10+j;
                }
            }
        }
        return -1;
    }


}
