package jakarta.persistence;

/**
 * Utilizar mapeamento de lista com getters e setters tratando como se fosse um objeto
 */
@Deprecated
public @interface OneToOne {

    /*
    @Builder.Default
    @OneToMany(mappedBy = "bookkeeping", cascade = CascadeType.ALL)
    private List<BlockE> blockE = new ArrayList<>();

    public BlockE getBlockE() {
        return blockE.isEmpty() ? null : blockE.getFirst();
    }

    public void setBlockE(BlockE entity) {
        this.blockE.clear();
        if (entity != null) {
            this.blockE.add(entity);
            entity.setBookkeeping(this);
        }
    }
     */

}
