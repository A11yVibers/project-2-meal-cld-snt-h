import { APPROVED_IMAGES } from '../approved-images.js'
import { CUISINE_BY_ID, MEAL_TYPE_BY_ID, DIETARY_TAG_BY_ID } from '../data/lookups.js'
import { formatMinutes } from '../utils/date.js'
import Badge from './Badge.jsx'

export default function RecipeCard({ recipe, onSelect }) {
  const cuisine = CUISINE_BY_ID[recipe.cuisineId]
  const mealType = MEAL_TYPE_BY_ID[recipe.mealTypeId]
  const imageUrl = recipe.coverImageUrl || APPROVED_IMAGES.placeholder

  return (
    <button className="recipe-card" onClick={() => onSelect(recipe.id)} style={{ '--accent': recipe.accentColor || '#D97757' }}>
      <div className="recipe-card__image-wrap">
        <img className="recipe-card__image" src={imageUrl} alt="" />
        {recipe.isUserRecipe && <span className="recipe-card__pill">Your recipe</span>}
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <div className="recipe-card__meta">
          {mealType && <Badge>{mealType.name}</Badge>}
          {cuisine && <Badge tone="muted">{cuisine.name}</Badge>}
        </div>
        <div className="recipe-card__facts">
          <span>⏱ {formatMinutes(recipe.totalTime)}</span>
          <span>🍽 {recipe.servings} servings</span>
        </div>
        {recipe.dietaryTagIds?.length > 0 && (
          <div className="recipe-card__tags">
            {recipe.dietaryTagIds.slice(0, 3).map((id) => (
              <Badge tone="soft" key={id}>
                {DIETARY_TAG_BY_ID[id]?.name || id}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
