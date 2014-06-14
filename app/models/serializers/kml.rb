require 'ruby_kml'

class KMLExport < Struct.new(:map)
  def call
    kml = KMLFile.new
    folder = KML::Folder.new(:name => map[:name])

    map.lines.each do |line|
      folder.features << KML::LineStyle.new(
        color: line.color,
      )

      folder.features << KML::Placemark.new(
        :name => line.name,
        :geometry => KML::LineString.new(:coordinates => line.to_flattened_lnglat),
      )
    end

    kml.objects << folder
    kml.render
  end
end
