
public class Main {
    public static void main(String[] args) {
        Player player1=new Player();
        Player player2=new Player();
        for(int i=0;i<8;i++){
            for(int j=0;j<8;j++){
                if ((i <= 1 && j <= 1) || (i == 0 && j == 2)) {
                    Node.board[i][j] = new Node(player1);
                    continue;
                }
                if((i >= 6 && j >= 6) || (i == 7 && j == 5)){
                    Node.board[i][j] = new Node(player2);
                    continue;
                }
                Node.board[i][j]=new Node();
            }
        }
        System.out.println(Node.board[0][0].getOwnby());

        player1.Spawnminion(1,1);
        player1.Spawnminion(1,1);
        player1.Spawnminion(8,3);
        player1.Spawnminion(1,2);
        System.out.println(player1.minion);
        player1.Spawnminion(2,2);

        player2.Spawnminion(8,8);
        player2.buyspawmhex(6,8);
        System.out.println(Node.board[5][7].getOwnby());
        System.out.println(player2);

        Node.board[0][0].getIsminion().move(4);


    }
}