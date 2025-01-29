public class Minion {
    private int def=10;
    private int hp=1000;
    private StrategyParser strategy;
    private int col,row;
    final Player ownby;

    public Minion(Player ownby) {
        this.ownby = ownby;
    }

    public int getDef() {
        return def;
    }

    public int getHp() {
        return hp;
    }

    public int getRealCol() {
        return col;
    }

    public int getRealRow() {
        return row;
    }

    public void setCol(int col) {
        this.col = col;
    }
    public void setRow(int Row) {
        this.row = Row;
    }
    public void setHp(int Hp) {
        this.hp = Hp;
    }

    protected void move(int direction) {
        int newPos = getDirection(direction, row, col);

        if (newPos == -1) {
            System.out.println("cant move to that direction");
            return;
        }

        Node.board[row - 1][col - 1].setIsminion(null);
        row = newPos / 10;
        col = newPos % 10;
        Node.board[row - 1][col - 1].setIsminion(this);
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
        if(Node.board[row - 1][col - 1].getIsminion()==null){
            return;
        }
        int hp=Node.board[row - 1][col - 1].getIsminion().getHp();
        int def=Node.board[row - 1][col - 1].getIsminion().getDef();
        if(cost-1<=def){
            Node.board[row - 1][col - 1].getIsminion().setHp(hp-1);
        }else{
            Node.board[row - 1][col - 1].getIsminion().setHp((int) (cost -1-def));
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
