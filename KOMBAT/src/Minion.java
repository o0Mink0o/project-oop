public class Minion {
    private int def=5;
    private int hp=100;
    private Strategy strategy;
    private int col,row;
    final Player ownby;

    protected Minion(Player ownby) {
        this.ownby = ownby;
    }


    protected int getDef() {
        return def;
    }

    protected int getHp() {
        return hp;
    }

    protected int getRealCol() {
        return col;
    }

    protected int getRealRow() {
        return row;
    }

    protected void setCol(int col) {
        this.col = col;
    }
    protected void setRow(int Row) {
        this.row = Row;
    }
    protected void setHp(int Hp) {
        this.hp = Hp;
    }

    protected void move(int direction) {
        int newPos = getDirection(direction, row, col);

        if (newPos == -1) {
            System.out.println("cant move to that direction");
            return;
        }

        Hex.getHex(row,col).setIsminion(null);
        row = newPos / 10;
        col = newPos % 10;
        Hex.getHex(row,col).setIsminion(this);
    }

    protected void shoot(int direction,double cost) {
        int target = getDirection(direction, row, col);
        this.ownby.budget-=cost;

        if (target == -1) {
            System.out.println("cant shoot to that direction");
            return;
        }
        int targetRow = target / 10;
        int targetCol = target % 10;
        if(Hex.getHex(targetRow, targetCol).getIsminion()==null){
            return;
        }
        int hp= Hex.getHex(targetRow, targetCol).getIsminion().getHp();
        int def= Hex.getHex(targetRow, targetCol).getIsminion().getDef();
        if(cost-1<=def){
            Hex.getHex(targetRow, targetCol).getIsminion().setHp(hp-1);
        }else{
            Hex.getHex(targetRow, targetCol).getIsminion().setHp(hp-(int) (cost -1-def));
        }
        if(Hex.getHex(targetRow, targetCol).getIsminion().getHp()<=0){
            Hex.getHex(targetRow, targetCol).setIsminion(null);
        }
    }

    private static int getDirection(int direction, int row, int col) {
        int newRow = row, newCol = col;

        switch (direction) {
            case 1:
                newRow--;
                break;
            case 2:
                newCol++;
                if (col % 2 == 0) newRow--;
                break;
            case 3:
                newCol++;
                if (col % 2 != 0) newRow++;
                break;
            case 4:
                newRow++;
                break;
            case 5:
                newCol--;
                if (col % 2 != 0) newRow++;
                break;
            case 6:
                newCol--;
                if (col % 2 == 0) newRow--;
                break;
            default:
                return -1;
        }

        if (newRow < 1 || newRow > 8 || newCol < 1 || newCol > 8) {
            return -1;
        }

        return newRow * 10 + newCol;
    }

    protected int getNearby(int direction) {
        int target = getDirection(direction, row, col);
        int targetRow = target / 10;
        int targetCol = target % 10;
        for(int i=1;target!=-1;i++){
            if(Hex.getHex(targetRow, targetCol).getIsminion()!=null){
                int hp = Hex.getHex(targetRow, targetCol).getIsminion().getHp();
                int def= Hex.getHex(targetRow, targetCol).getIsminion().getDef();
                if(this.ownby==Hex.getHex(targetRow, targetCol).getIsminion().ownby){
                    return (hp*100+def*10+i)*-1;
                }
                return hp*100+def*10+i;
            }
            target = getDirection(direction, row, col);
        }
        return 0;
    }

}
