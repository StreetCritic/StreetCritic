node_keys = {}
way_keys = {"highway"}

function way_function()
  Layer("transportation", false)
  local tags = AllTags()
  for key, value in pairs(tags) do
    if string.sub(key, 1, 23) == "streetcritic:indicator:" then
      Attribute(key, value)
    end
  end
end
