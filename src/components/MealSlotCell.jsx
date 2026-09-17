import { APPROVED_IMAGES } from '../approved-images.js'

export default function MealSlotCell({ recipe, onOpenRecipe, onAssign, onClear }) {
  if (!recipe) {
    return (
      <button className="meal-slot meal-slot--empty" onClick={onAssign}>
        <span>+ Add recipe</span>
      </button>
    )
  }

  return (
    <div className="meal-slot meal-slot--filled" style={{ '--accent': recipe.accentColor || '#D97757' }}>
      <button className="meal-slot__main" onClick={() => onOpenRecipe(recipe.id)}>
        <img src={recipe.coverImageUrl || APPROVED_IMAGES.placeholder} alt="" />
        <span className="meal-slot__title">{recipe.title}</span>
      </button>
      <div className="meal-slot__controls">
        <button className="icon-btn" title="Replace recipe" onClick={onAssign}>
          ⇄
        </button>
        <button className="icon-btn icon-btn--danger" title="Remove from plan" onClick={onClear}>
          ✕
        </button>
      </div>
    </div>
  )
}
