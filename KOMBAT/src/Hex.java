public class Hex {
    private Player ownby;
    private Minion Isminion;
    protected static Hex[][] board =new Hex[8][8];

    public Hex() {

    }
    
    protected static Hex getHex(int row, int col) {
        return board[row-1][col-1];
    }

    public Hex(Player ownby) {
        this.ownby = ownby;
    }


    protected Player getOwnby() {
        return ownby;
    }

    protected void setOwnby(Player ownby) {
        this.ownby = ownby;
    }

    protected Minion getIsminion() {
        return Isminion;
    }

    protected void setIsminion(Minion isminion) {
        Isminion = isminion;
    }

    protected boolean canbuy(Player player) {
        if(ownby!=null){
            return false;
        }
        int xy = this.getPosition(),x=xy/10, y=xy%10;
        if(x>0){
            if(Hex.board[x-1][y].ownby==player){
                return true;
            }
        }
        if(y>0){
            if(Hex.board[x][y-1].ownby==player){
                return true;
            }
        }
        if(x<8){
            if(Hex.board[x+1][y].ownby==player){
                return true;
            }
        }
        if(y<8){
            if(Hex.board[x][y+1].ownby==player){
                return true;
            }
        }
        if(y%2==0){
            if(x!=7){
                if (Hex.board[x + 1][y + 1].ownby == player) {
                    return true;
                }
                if(y!=0){
                    if(Hex.board[x+1][y-1].ownby==player){
                        return true;
                    }
                }

            }
        }else{
            if(x!=0){
                if (Hex.board[x - 1][y - 1].ownby == player) {
                    return true;
                }
                if(y!=7){
                    if(Hex.board[x-1][y+1].ownby==player){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private int getPosition() {
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
