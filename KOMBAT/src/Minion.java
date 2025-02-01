public class Minion {
    private int def=10;
    private int hp=1000;
    private StrategyParser strategy;
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

    private void shoot(int direction,double cost) {
        int target = getDirection(direction, row, col);
        this.ownby.budget-=cost;

        if (target == -1) {
            System.out.println("cant shoot to that direction");
            return;
        }
        row = target / 10;
        col = target % 10;
        if(Hex.getHex(row,col).getIsminion()==null){
            return;
        }
        int hp= Hex.getHex(row,col).getIsminion().getHp();
        int def= Hex.getHex(row,col).getIsminion().getDef();
        if(cost-1<=def){
            Hex.getHex(row,col).getIsminion().setHp(hp-1);
        }else{
            Hex.getHex(row,col).getIsminion().setHp((int) (cost -1-def));
        }
    }

    private int getDirection(int direction, int row, int col) {
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

}
