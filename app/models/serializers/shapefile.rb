require 'csv'
require 'dbf'
require 'geo_ruby/shp4r/shp'
require 'zip'

class Shapefile < Struct.new(:map)
  PROJ = %{GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]}.freeze
  TMP_DIR = Transitmix::App.root + '/tmp'

  def shpfile
    @shpfile ||= GeoRuby::Shp4r::ShpFile.create(TMP_DIR + "/#{map.id}.shp",
      GeoRuby::Shp4r::ShpType::POLYLINE,
      [DBF::Field.new('route_id','N',10),
       DBF::Field.new('route_name','C',50),
       DBF::Field.new('speed','F',32),
       DBF::Field.new('peak_am','N',10),
       DBF::Field.new('midday','N',10),
       DBF::Field.new('peak_pm','N',10),
       DBF::Field.new('night','N',10)])
  end

  def build_shpfile
    map.lines.each do |line|
      shpfile.transaction do |tr|
        geo = GeoRuby::SimpleFeatures::LineString.from_coordinates(line.to_flattened_lnglat)
        fields = {
          'route_id' => line.id,
          'route_name' => line.name,
          'speed' => line.speed.to_f,
          'peak_am' => line.service_windows[0]['headway'],
          'midday' => line.service_windows[1]['headway'],
          'peak_pm' => line.service_windows[2]['headway'],
          'night' => line.service_windows[3]['headway']
        }
        puts fields
        tr.add(GeoRuby::Shp4r::ShpRecord.new(geo, fields))
      end
    end

    shpfile.close
  end

  def build_geom2gtfs_json
    File.write(TMP_DIR + "/#{map.id}.json", JSON.generate({
      'agency_name'=>map.name,
      'agency_url'=>'http://www.transitmix.net/',
      'agency_timezone'=>'America/Argentina/Buenos_Aires',
      'gtfs_mode'=>3,
      'exact'=>true,
      'use_periods'=>true,
      'is_bidirectional'=>true,
      'service_windows'=>[["peak_am",7,10],["midday",10,16],["peak_pm",15,18],["night",18,23]],
      'speed'=>5.4,
      'stops'=>{'strategy'=>'picket', 'spacing'=>400},
      'route_id_prop_name'=>'route_id',
      'route_name_prop_name'=>'route_name',
      'start_date'=>'20140101',
      'end_date'=>'20150101'
    }))
  end

  def build_projection
    File.write(TMP_DIR + '/' + "#{map.id}.prj", PROJ)
  end

  def build_zipfile
    filenames = ["#{map.id}.shp", "#{map.id}.shx", "#{map.id}.dbf", "#{map.id}.json", "#{map.id}.prj"]
    zipfile_name = TMP_DIR + "/#{map.id}.zip"

    Zip.continue_on_exists_proc = true
    Zip::File.open(zipfile_name, Zip::File::CREATE) do |zipfile|
      filenames.each do |filename|
        zipfile.add(filename, TMP_DIR + '/' + filename)
      end
    end
  end

  def call
    build_shpfile
    build_geom2gtfs_json
    build_projection
    build_zipfile

    File.read(TMP_DIR + "/#{map.id}.zip") 
  end
end
