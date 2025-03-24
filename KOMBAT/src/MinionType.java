public class MinionType {
    public final String name;
    public final int def;
    public final Strategy strategy;

    public MinionType(String name, int def, String strategy) {
        this.name = name;
        this.def = def;
        this.strategy = ReadStrategy.safeParse(strategy);
    }

    public MinionType(String name, int def, Strategy strategy) {
        this.name = name;
        this.def = def;
        this.strategy = strategy;
    }
}